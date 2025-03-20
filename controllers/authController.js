import express from 'express'
import { Authenticate, Authorize, refreshAccessToken } from '../utils/authUtils.js';

export const authController = express.Router()

authController.post('/login', (req, res) => { Authenticate(req, res) })
authController.get('/authorize', Authorize, (req, res, next) => { res.send({ message: 'You are logged in'}) })
authController.post('/refresh', async (req, res) => { return refreshAccessToken(req, res) })