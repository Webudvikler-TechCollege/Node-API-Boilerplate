import express from 'express'
import { dbController } from './Controllers/dbController.js'
import { userController } from './controllers/userController.js'
import { authController } from './controllers/authController.js'
import { exampleController } from './controllers/exampleController.js'
import { Relations } from "./models/relations.js";

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Test 2025 - Sætter alle db relationer op i seperat fil
Relations();

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use(
    exampleController,
    userController,
    authController,
    dbController
)

app.get('*', (req, res) => {
    res.send('404 - kunne ikke finde siden')
})

app.listen(4242, () => {
    console.log(`Server kører på adressen http://localhost:4242`)
})