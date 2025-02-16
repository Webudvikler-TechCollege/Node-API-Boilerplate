import express from 'express'
import cors from 'cors'
import { dbController } from './Controllers/dbController.js'
import { userController } from './controllers/userController.js'
import { authController } from './controllers/authController.js'
import { exampleController } from './controllers/exampleController.js'
import { setRelations } from "./models/relations.js";

// Express Route Settings
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// Test 2025 - Sætter alle db relationer op i seperat fil
setRelations();

// Route for root
app.get('/', (req, res) => {
    res.send('Hello world')
})

// Use controllers
app.use(
    exampleController,
    userController,
    authController,
    dbController
)

// 404 route - skal være sidst!
app.get('*', (req, res) => {
    res.send('404 - kunne ikke finde siden')
})

// Server settings
app.listen(4242, () => {
    console.log(`Server kører på adressen http://localhost:4242`)
})