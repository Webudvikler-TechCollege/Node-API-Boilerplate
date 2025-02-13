import express from 'express';
import { tempModel as model }  from '../models/tempModel.js';
import { errorResponse, successResponse } from '../utils/mainUtils.js';

export const tempController = express.Router();
const url = 'temp'

/**
 * READ: Fetch all records from the database
 */
tempController.get(`/${url}`, async (req, res) => {
    try {
        const list = await model.findAll();

        // Check if no data is found
        if (!list || list.length === 0) {
            return errorResponse(res, `No cities found`, 404)
        }

        successResponse(res, list);
    } catch (error) {
        errorResponse(res, `Error fetching cities: ${error.message}`);
    }
});

/**
 * READ: Fetch a single record by ID
 */
tempController.get(`/${url}/:id([0-9]+)`, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        let details = await model.findOne({
            where: { id: id }
        });

        if (!details) return errorResponse(res, `City not found`, 404);

        successResponse(res, city);
    } catch (error) {
        errorResponse(res, `Error fetching city details: ${error.message}`);
    }
});

/**
 * CREATE: Add a new record to the database
 */
tempController.post(`/${url}`, async (req, res) => {
    try {
        let { zipcode, name } = req.body;
        const result = await model.create({ zipcode, name });
        successResponse(res, result, `City created successfully`, 201);
    } catch (error) {
        errorResponse(res, `Error creating city`, error);
    }
});

/**
 * UPDATE: Update an existing record
 */
tempController.put(`/${url}/:id([0-9]+)`, async (req, res) => {
    try {
        const { id } = req.params;
        const { zipcode, name } = req.body;

        const [updated] = await model.update(
            { zipcode, name }, 
            { 
                where: { id }, 
                individualHooks: true 
            }
        );

        if (!updated) return errorResponse(res, `No city found with ID: ${id}`, 404);

        successResponse(res, { id, zipcode, name }, `City updated successfully`);

    } catch (error) {
        errorResponse(res, `Error updating city`, error);
    }
});

/**
 * DELETE: Remove a record by ID
 */
tempController.delete(`/${url}/:id([0-9]+)`, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await model.destroy({ where: { id } });

        if (!deleted) return errorResponse(res, `No city found with ID: ${id}`, 404);

        successResponse(res, null, `City deleted successfully`);
    } catch (error) {
        errorResponse(res, `Error deleting city: ${error.message}`);
    }
});