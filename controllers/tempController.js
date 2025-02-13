import express from 'express';
import { tempModel as model }  from '../models/tempModel.js';
import { errorResponse, successResponse } from '../utils/mainUtils.js';

export const tempController = express.Router();

const url = model.tableName
const element_name = model.name
const elements_name = model.tableName

/**
 * READ: Fetch all records from the database
 */
tempController.get(`/${url}`, async (req, res) => {
    try {
        const list = await model.findAll();

        // Check if no data is found
        if (!list || list.length === 0) {
            return errorResponse(res, `No ${elements_name} found`, 404)
        }

        successResponse(res, list);
    } catch (error) {
        errorResponse(res, `Error fetching ${elements_name}: ${error.message}`);
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

        if (!details) return errorResponse(res, `${element_name} not found`, 404);

        successResponse(res, city);
    } catch (error) {
        errorResponse(res, `Error fetching ${elements_name}: ${error.message}`);
    }
});

/**
 * CREATE: Add a new record to the database
 */
tempController.post(`/${url}`, async (req, res) => {
    try {
        let { zipcode, name } = req.body;
        const result = await model.create({ zipcode, name });
        successResponse(res, result, `${element_name} created successfully`, 201);
    } catch (error) {
        errorResponse(res, `Error creating ${element_name}`, error);
    }
});

/**
 * UPDATE: Update an existing record
 */
tempController.put(`/${url}/:id([0-9]+)`, async (req, res) => {
    try {
        const { id } = req.params;
        const { zipcode, name } = req.body;

        const [updated] = await model.update({ zipcode, name }, { where: { id } });

        if (!updated) return errorResponse(res, `No ${element_name} found with ID: ${id}`, 404);

        successResponse(res, { id, zipcode, name }, `${element_name} updated successfully`);

    } catch (error) {
        errorResponse(res, `Error updating ${element_name}`, error);
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

        successResponse(res, null, `${element_name} deleted successfully`);
    } catch (error) {
        errorResponse(res, `Error deleting ${element_name}: ${error.message}`);
    }
});