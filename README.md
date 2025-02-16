# Node-API-Boilerplate
Boilerplate bygget i NodeJS, Express og Sequelize med MySQL database som datakilde.

## Overordnet filstruktur
API'et er bygget efter MVC (Model VIew Controller) hvor hver element har sin egen model og controller fordelt i mapperne *models* og *controllers*.

Controllerne håndterer routes til de specifikke endpoint men overordnede routes (root og 404 mm) ligger i index.js filen.

## Postman
Der ligger en Postman dokumentation på nedenstående link som giver et overblik over de forskellige endpoints i API'et og kan fungere som en template:
https://documenter.getpostman.com/view/6540576/2sAYXEEyBu

## Database
Du skal selv oprette en database og indtaste dine bruger oplysninger til din denne i filen `.env`.

## .env
Husk at oprette en .env fil i roden af dit repository og kopiere følgende ind i filen. Husk at tilrette dine egne database credentials. 

NB: Default bruger password er også genreret med secret string fra nedenstående kode.
```
# Port Number
PORT = 3000

# Database Credentials
DBHOST = [localhost]
DBNAME = [database_name]
DBUSER = [database_user]
DBPASSWD = [database_password]

# Token keys ############

# Token Access Key
TOKEN_ACCESS_KEY = myprivatekey # SECRET STRING 
TOKEN_ACCESS_EXPIRATION_SECS = 3600 # NUMBER OF EXPIRATION SECONDS: 1 HOUR

# Token Refresh Key
TOKEN_REFRESH_KEY = myprivaterefreshkey # SECRET STRING 
TOKEN_REFRESH_EXPIRATION_SECS = 86400 # NUMBER OF EXPIRATION SECONDS: 1 DAY
```
## Database Controller (DbController)
Denne controller kan teste forbindelse din database, synce og seede dine modeller:
* /test - Tester om der er forbindelse til databasen
* /sync - Synkroniserer modeller med databasen
* /seedfromcsv - Sync'er og seeder data fra csv filer i mappen /data/

## Start API'et
1. Kør kommandoen npm i i terminalen for at installere dependencies.
2. Kør `nodemon` i terminalen for at starte projektet. Databasen skal selvfølgelig være sat op før at API'et vil virke.