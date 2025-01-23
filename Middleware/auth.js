import jwt from "jsonwebtoken"
import dotenv from "dotenv" // Credentials
import bcrypt from "bcrypt"
import Users from "../Models/System/user.model.js"

dotenv.config()

const Authenticate = async (req, res) => {
    // Destructure Assignment af username og password fra request body
  const { username, password } = req.body

  // Hvis brugernavn og password findes...
  if (username && password) {
    // Henter db user ud fra username
    const user_result = await Users.findOne({
      attributes: ["id", "firstname", "lastname", "password"],
      where: { email: username, is_active: 1 },
    })

    if (!user_result) {
      // Returner forbidden hvis bruger ikke eksisterer
      res.sendStatus(401)
    } else {
      // Deklarerer user objekt af user values
      const data = {
        id: user_result.get("id"),
        firstname: user_result.get("firstname"),
        lastname: user_result.get("lastname"),
        password: user_result.get("password"),
      }

      // Validerer krypterede passwords
      bcrypt.compare(password, data.password, (err, result) => {
        if (result) {
          // REFRESH TOKEN

          // Deklarerer var med udløbsdtid for refresh_token
          // (plus foran konverterer til tal)
          const expRefreshDate =
            Math.floor(Date.now() / 1000) +
            +process.env.TOKEN_REFRESH_EXPIRATION_SECS

          // Genererer refresh token ud fra udløbstid, user_id og token_refresh_key
          const refresh_token = jwt.sign(
            {
              exp: expRefreshDate,
              data: { id: data.id },
            },
            process.env.TOKEN_REFRESH_KEY
          )

          // Updater refresh token i bruger database
          Users.update(
            { refresh_token, refresh_token },
            {
              where: { id: data.id },
            }
          )

          // ACCESS_TOKEN

          // Deklarerer var med udløbsdtid for access_token
          // (plus foran konverterer til tal)
          const expAccessDate =
            Math.floor(Date.now() / 1000) +
            +process.env.TOKEN_ACCESS_EXPIRATION_SECS

          // Deklarerer payload var af user values
          const payload = {
            id: data.id,
            firstname: data.firstname,
            lastname: data.lastname,
            email: username,
          }

          // Genererer access token
          const access_token = jwt.sign(
            {
              exp: expAccessDate,
              data: payload,
            },
            process.env.TOKEN_ACCESS_KEY
          )

          // Returnerer access_token til requester
          return res.json({
            access_token: access_token,
            user: {
              id: `${data.id}`,
              firstname: `${data.firstname}`,
              lastname: `${data.lastname}`
            },
            created: Date(),
          })
        } else {
          // Returner 401 Unauthorized
          return res.sendStatus(401)
        }
      })
    }
  } else {
    // Returner 401 Forbidden
    return res.sendStatus(403)
  }
}

/**
 * Authorize User
 * Tjekker om bruger rent faktisk har adgang via en access_token og refresh_token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const Authorize = async (req, res, next) => {
  // Henter access token fra auth header
  const bearerHeader = req.headers["authorization"]  
  let access_token;  

  if(bearerHeader && bearerHeader.includes('Bearer')) {
    access_token = bearerHeader.substr(7) // Remove "Bearer "  
  } else {
    res.status(401).send({ message: 'Token not accepted' })
  }

  // Bekræfter access_token med access_key
  jwt.verify(access_token, process.env.TOKEN_ACCESS_KEY, (err, data) => {
    if (err) {
      console.log(err.message);
      switch (err.message) {
        case "jwt malformed":
        case "invalid algorithm":
        case "invalid signature":
          // Returnerer statuskode (403: Forbidden)
          res.status(403).send({
            message: err.message
          })
          break
        case "jwt expired":
          // Refresh token
          // Decoder auth token med access_key
          // Dette returnerer et objekt med brugerdata
          // og her henter vi bruger id
          const { id } = jwt.decode(
            access_token,
            process.env.TOKEN_ACCESS_KEY
          ).data
          // Henter db bruger ud fra id
          Users.findOne({
            where: { id: id, is_active: 1 },
          }).then(record => {
            if (!record?.refresh_token) {
              // Returnerer statuskode (400: Bad Request)
              res.sendStatus(400)
            } else {
              // Bekræfter brugers refresh_token
              jwt.verify(
                record.refresh_token,
                process.env.TOKEN_REFRESH_KEY,
                (err, data) => {
                  if (err) {
                    switch (err.message) {
                      case "jwt expired":
                      case "jwt malformed":
                        // Returerner besked om at refresh_token er udløbet
                        // Betyder at bruger skal logge ind igen
                        res.status(400).send({ 
                          message: "Refresh token malformed or expired. Please login again." 
                        })
                        break
                      case "invalide token":
                        // Returnerer statuskode (400: Bad Request)
                        res.sendStatus(400)
                        break
                    }
                  } else {
                    // Genererer ny access token

                    // Deklarerer var med udløbsdtid for access_token
                    // (plus foran konverterer til tal)
                    const expDate =
                      Math.floor(Date.now() / 1000) +
                      +process.env.TOKEN_ACCESS_EXPIRATION_SECS

                    // Deklarerer payload var ud fra brugers db data
                    const payload = {
                      id: id,
                      firstname: record.firstname,
                      lastname: record.lastname,
                      email: record.email,
                    }

                    // Genererer token ud fra payload og access tid
                    const access_token = jwt.sign(
                      {
                        exp: expDate,
                        data: payload,
                      },
                      process.env.TOKEN_ACCESS_KEY
                    )

                    // Returnerer access_token til requester
                    return res.json({
                      access_token: access_token,
                      updated: Date(),
                    })
                    next()
                  }
                }
              )
            }
          })
          break
      }
    } else {
      // Sender bruger videre til næste trin i router
      next()
    }
  })
}

/**
 * Metode til at hente bruger id ud fra en token
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUserFromToken = async (req, res) => {
  const bearerHeader = req.headers["authorization"];

  if(bearerHeader && bearerHeader.includes('Bearer ')) {
    const token = bearerHeader.split(' ')[1]
    try {
      const decodeToken = jwt.verify(token, process.env.TOKEN_ACCESS_KEY)
      const user_id = await decodeToken.data.id
      console.log(user_id);
      return user_id
    } catch(err) {
      console.error(err)
    }
  }
}


/**
 * Decode token - NOT IN USE
 * @param {*} token 
 */
const decodeToken = async (token) => {
  jwt.verify(token, process.env.TOKEN_REFRESH_KEY, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      // Handle error, e.g., token is invalid or expired
    } else {
      const payload = decoded;
      console.log('Decoded payload:', payload);
    }
  });  
}

export { Authenticate, Authorize, getUserFromToken }
