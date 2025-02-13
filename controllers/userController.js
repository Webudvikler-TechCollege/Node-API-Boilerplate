import express from 'express';
import { userModel as model } from '../models/userModel.js';
import { errorResponse, successResponse } from '../utils/mainUtils.js';
import { Authorize } from '../utils/authUtils.js';

export const tempController = express.Router();
const url = 'users'

/**
 * READ: Fetch all records from the database
 */
tempController.get(`/${url}`, Authorize, async (req, res) => {
    try {
        const list = await model.findAll();

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
tempController.get(`/${url}/:id([0-9]+)`, Authorize, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        let details = await model.findOne({
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
tempController.post(`/${url}`, Authorize, async (req, res) => {
    try {
        let { firstname, lastname, email, password, refresh_token, is_active } = req.body;
        const result = await model.create({ firstname, lastname, email, password, refresh_token, is_active });
        successResponse(res, result, `User created successfully`, 201);
    } catch (error) {
        errorResponse(res, `Error creating user`, error);
    }
});

/**
 * UPDATE: Update an existing record
 */
tempController.put(`/${url}/:id([0-9]+)`, Authorize, async (req, res) => {
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
tempController.delete(`/${url}/:id([0-9]+)`, Authorize, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await model.destroy({ where: { id } });

        if (!deleted) return errorResponse(res, `No user found with ID: ${id}`, 404);

        successResponse(res, null, `User deleted successfully`);
    } catch (error) {
        errorResponse(res, `Error deleting user: ${error.message}`);
    }
});