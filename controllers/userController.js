import express from 'express';
import { userModel as model } from '../models/userModel.js';
import { errorResponse, successResponse } from '../utils/responseUtils.js';
import { Authorize } from '../utils/authUtils.js';

export const userController = express.Router();
const url = 'users'

/**
 * READ: Fetch all records from the database
 */
userController.get(`/${url}`, Authorize, async (req, res) => {
    try {
        const list = await model.findAll({
            attributes: ['id', 'firstname', 'lastname', 'email']
        });

        // Check if no data is found
        if (!list || list.length === 0) {
            return errorResponse(res, `No users found`, 404)
        }

        successResponse(res, list);
    } catch (error) {
        errorResponse(res, `Error fetching users: ${error.message}`);
    }
});

/**
 * READ: Fetch a single record by ID
 */
userController.get(`/${url}/:id([0-9]+)`, Authorize, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        let details = await model.findOne({
            attributes: ['id', 'firstname', 'lastname', 'email', 'is_active', 'createdAt', 'updatedAt'],
            where: { id: id }
        });

        if (!details) return errorResponse(res, `User not found`, 404);

        successResponse(res, details);
    } catch (error) {
        errorResponse(res, `Error fetching User details: ${error.message}`);
    }
});

/**
 * CREATE: Add a new record to the database
 */
userController.post(`/${url}`, Authorize, async (req, res) => {
    try {
        let {
            firstname,
            lastname, 
            email, 
            password, 
            refresh_token, 
            is_active 
        } = req.body;

        const result = await model.create({ firstname, lastname, email, password, refresh_token, is_active });
        
        successResponse(res, result, `User created successfully`, 201);
    } catch (error) {
        errorResponse(res, `Error creating user`, error);
    }
});

/**
 * UPDATE: Update an existing record
 */
userController.put(`/${url}/:id([0-9]+)`, Authorize, async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, password, refresh_token, is_active } = req.body;

        const [updated] = await model.update({ firstname, lastname, email, password, refresh_token, is_active }, { where: { id } });

        if (!updated) return errorResponse(res, `No user found with ID: ${id}`, 404);

        successResponse(res, { id, zipcode, name }, `User updated successfully`);

    } catch (error) {
        errorResponse(res, `Error updating user`, error);
    }
});

/**
 * DELETE: Remove a record by ID
 */
userController.delete(`/${url}/:id([0-9]+)`, Authorize, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await model.destroy({ where: { id } });

        if (!deleted) return errorResponse(res, `No user found with ID: ${id}`, 404);

        successResponse(res, null, `User deleted successfully`);
    } catch (error) {
        errorResponse(res, `Error deleting user: ${error.message}`);
    }
});