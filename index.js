import express from 'express'
import cors from 'cors'
import path from 'path'
import dontenv from 'dotenv'
import { fileURLToPath } from 'url';
import { dbController } from './Controllers/dbController.js'
import { userController } from './controllers/userController.js'
import { authController } from './controllers/authController.js'
import { exampleController } from './controllers/exampleController.js'
dontenv.config()
const port = process.env.SERVERPORT || 3000

// Express Route Settings
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// Define a route to serve static images
const currentUrl = import.meta.url;
const currentPath = fileURLToPath(currentUrl);
const currentDir = path.dirname(currentPath);
app.use('/assets', express.static(path.join(currentDir, 'assets')));

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
app.listen(port, () => {
    console.log(`Server kører på adressen http://localhost:${port}`)
})