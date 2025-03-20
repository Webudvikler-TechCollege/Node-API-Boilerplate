/**
 * Authentication and Authorization Module
 *
 * This module provides authentication and authorization functionality for users.
 * - `Authenticate`: Validates user credentials and generates JWT tokens.
 * - `Authorize`: Middleware that checks access tokens.
 * - `refreshAccessToken`: Generates a new access token from a refresh token.
 * - `getUserFromToken`: Extracts user ID from a given JWT token.
 */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { userModel } from "../models/userModel.js";

dotenv.config();

/**
 * Generates a JWT token (either access or refresh) for a user.
 * @param {Object} user - The user object containing user details.
 * @param {string} type - The type of token to generate ("access" or "refresh").
 * @returns {string} - The generated JWT token.
 */
const generateToken = (user, type) => {
    const expTime = Math.floor(Date.now() / 1000) + +process.env[`TOKEN_${type.toUpperCase()}_EXPIRATION_SECS`];
    return jwt.sign({ exp: expTime, data: { id: user.id } }, process.env[`TOKEN_${type.toUpperCase()}_KEY`]);
};

/**
 * Authenticates a user by validating their credentials and generating JWT tokens.
 * @param {Object} req - The request object containing user credentials.
 * @param {Object} res - The response object to send the tokens.
 */
const Authenticate = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.sendStatus(400); // Bad request if credentials are missing

    try {
        // Find user in the database
        const user = await userModel.findOne({
            attributes: ["id", "firstname", "lastname", "password"],
            where: { email: username, is_active: 1 },
        });

        if (!user) return res.sendStatus(401); // Unauthorized if user does not exist

        // Validate password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.sendStatus(401); // Unauthorized if password is incorrect

        // Generate JWT tokens
        const refresh_token = generateToken(user, "refresh");
        const access_token = generateToken(user, "access");

        // Store the refresh token in the database
        await userModel.update({ refresh_token }, { where: { id: user.id } });

        // Send only access_token and user data
        return res.json({
            access_token,
            refresh_token,
            user: { id: user.id, firstname: user.firstname, lastname: user.lastname },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * Middleware to authorize user requests by validating JWT access tokens.
 * @param {Object} req - The request object containing the access token.
 * @param {Object} res - The response object to send error messages.
 * @param {Function} next - Calls the next middleware if the user is authorized.
 */
const Authorize = async (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token not accepted" });
    }

    const token = bearerHeader.split(" ")[1];

    try {
        // Verify the access token
        const decoded = jwt.verify(token, process.env.TOKEN_ACCESS_KEY);
        req.user = decoded.data;
        next();
    } catch (err) {
        return res.status(403).json({ message: err.message }); // Forbidden if token is invalid
    }
};

/**
 * Refreshes an expired access token using a valid refresh token.
 * @param {Object} req - The request object containing the refresh token.
 * @param {Object} res - The response object to send the new access token.
 */
const refreshAccessToken = async (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        // Find user by refresh token
        const user = await userModel.findOne({ where: { refresh_token } });

        if (!user) {
            return res.status(400).json({ message: "Invalid refresh token" });
        }

        // Verify refresh token
        jwt.verify(refresh_token, process.env.TOKEN_REFRESH_KEY);

        // Generate new access token
        const access_token = generateToken(user, "access");

        return res.json({ access_token });
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

/**
 * Extracts the user ID from a JWT access token.
 * @param {Object} req - The request object containing the access token.
 * @param {Object} res - The response object to send the extracted user ID.
 */
const getUserFromToken = async (req, res) => {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
        return res.sendStatus(401); // Unauthorized if token is missing
    }

    try {
        const token = bearerHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.TOKEN_ACCESS_KEY);
        return res.json({ userId: decoded.data.id });
    } catch {
        return res.status(401).json({ message: "Invalid token" }); // Unauthorized if token is invalid
    }
};

export { Authenticate, Authorize, refreshAccessToken, getUserFromToken };
