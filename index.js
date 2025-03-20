import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dbController } from './Controllers/dbController.js';
import { userController } from './controllers/userController.js';
import { authController } from './controllers/authController.js';
import { exampleController } from './controllers/exampleController.js';

dotenv.config();
const port = process.env.SERVERPORT || 3000;

// Express Route Settings
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Static Files: Serve images and other assets
const currentUrl = import.meta.url;
const currentPath = fileURLToPath(currentUrl);
const currentDir = path.dirname(currentPath);
app.use('/assets', express.static(path.join(currentDir, 'assets')));

// Root Route
app.get('/', (req, res) => {
    res.send('Hello world');
});

// Register Controllers
app.use(
    exampleController,
    userController,
    authController,
    dbController
);

// 404 Route (Must be last)
app.get('*', (req, res) => {
    res.send('404 - Page not found');
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
