import express from 'express';
import { userModel } from '../models/userModel.js';

export const userController = express.Router();

/**
 * READ: Fetch all users from the database
 */
userController.get('/users', async (req, res) => {
    try {
        let users = await userModel.findAll();

        // Check if no users are found
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.json(users);
    } catch (error) {
        console.error("Error retrieving user list:", error);
        res.status(500).send({
            message: `Error fetching user list: ${error.message}`
        });
    }
});

/**
 * READ: Fetch a single user by ID
 */
userController.get('/users/:id([0-9]*)', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        let user = await userModel.findOne({
            where: { id: id }
        });

        // If no user is found, return a 404 error
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({
            message: `Error fetching user: ${error.message}`
        });
    }
});

/**
 * CREATE: Add a new user to the database
 */
userController.post('/users', async (req, res) => {
    let { firstname, lastname, email, password, refresh_token, is_active } = req.body;

    // Validate that all required fields are provided
    if (!firstname || !lastname || !email || !password || !refresh_token || is_active === undefined) {
        return res.status(400).json({ message: "All fields must be filled out" });
    }

    try {
        // Create a new user record in the database
        const result = await userModel.create({ firstname, lastname, email, password, refresh_token, is_active });
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: `Error creating user: ${error.message}` });
    }
});

/**
 * UPDATE: Update an existing user
 */
userController.put('/users', async (req, res) => {
    let { id, firstname, lastname, email, password, refresh_token, is_active } = req.body;

    // Validate that all required fields are provided
    if (!id || !firstname || !lastname || !email || !password || !refresh_token || is_active === undefined) {
        return res.status(400).json({ message: "All fields must be filled out" });
    }

    try {
        // Attempt to update the user in the database
        const result = await userModel.update(
            { firstname, lastname, email, password, refresh_token, is_active }, // Update only relevant fields
            { where: { id } }
        );

        // If no rows were updated, the user ID does not exist
        if (result[0] === 0) {
            return res.status(404).json({ message: `No user found with ID: ${id}` });
        }

        res.status(200).json({ message: `User with ID ${id} updated successfully.` });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({
            message: `Error updating user: ${error.message}`
        });
    }
});

/**
 * DELETE: Remove a user by ID
 */
userController.delete('/users/:id([0-9]*)', async (req, res) => {
    const { id } = req.params; // Extract the user ID from the URL parameters

    if (id) { // Check if an ID is provided
        try {
            // Attempt to delete the user from the database
            await userModel.destroy({
                where: { id }, // Delete the record where the ID matches
            });

            res.status(200).send({
                message: `User deleted successfully`, // Success response
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send({
                message: `Could not delete user: ${error.message}`, // Error message
            });
        }
    } else {
        // Send a 400 Bad Request error if the ID is missing or invalid
        res.status(400).send({
            message: "Invalid ID",
        });
    }
});
