import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { syncController } from './Controllers/syncController.js'
import { userController } from './Controllers/userController.js'
import { orgController } from './Controllers/orgController.js'
import { groupController } from './Controllers/groupController.js'

dotenv.config()
const port = process.env.PORT

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use((req, res, next) => {
	res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.append('Access-Control-Allow-Credentials', true);
	res.append('Access-Control-Allow-Headers', 'Content-Type');
	next();
})

app.get('/', (req,res) => {
	res.send('Node-API-Boilerplate is running')
})

app.use(userController, orgController, groupController, syncController)

app.listen(port, () => {
    console.log(`Express runs on http://localhost:${port}`)
})