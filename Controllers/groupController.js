import express from 'express'
import groupModel from '../Models/groupModel.js'
import { getAttributes, getLimit, getSortKey } from '../Utils/apiUtils.js'

/**
 * Controller for Group Actions
 */

export const groupController = express.Router()

groupController.get('/groups', async (req, res) => {
	try {
		const result = await groupModel.findAll({
			attributes: getAttributes(req, 'id, email'),
			order: getSortKey(req, 'id'),
			limit: getLimit(req)
		})
		res.json(result)
	} catch (error) {
		res.status(418).send({
			message: `Could not get api list: ${error}`
		})
	}
})

groupController.get('/groups/:id([0-9]*)', async (req, res) => {
	const { id } = req.params || 0

	if (id) {
		try {
			// Eksekverer sequelize metode med attributter og where clause
			const result = await groupModel.findOne({
				attributes: ['id', 'name', 'description', 'is_active', 'createdAt', 'updatedAt'],
				where: { id: id }
			})
			// Udskriver resultat i json format
			res.json(result)
		} catch (error) {
			res.status(418).send({
				message: `Could not get group details: ${error}`
			})
		}
	} else {
		res.status(403).send({
			message: 'Wrong parameter values'
		})
	}
})

groupController.post('/groups', async (req, res) => {
	// Destructure assignment af form data fra request body
	const { name, description, is_active } = req.body;
	// Tjekker felt data
	if (name && description && is_active) {
		try {
			// Opretter record
			const model = await groupModel.create(req.body)
			// Sender nyt id som json object
			res.json({
				message: `Record created`,
				newId: model.id
			})
		} catch (error) {
			res.status(418).send({
				message: `Could not create record: ${error}`
			})
		}
	} else {
		res.status(403).send({
			message: 'Wrong parameter values'
		})
	}
})

groupController.put('/groups', async (req, res) => {
	// Destructure assignment af id. 
	const { id } = req.params || 0
	// Destructure assignment af form data fra request body
	const { name, description, is_active } = req.body;
	// Tjekker felt data
	if (id && name && description && is_active) {
		try {
			// Opretter record
			const model = await Group.update(req.body, {
				where: { id: id }
			})
			// Sender nyt id som json object
			res.json({
				message: 'Record updated'
			})
		} catch (error) {
			res.status(418).send({
				message: `Could not update record: ${error}`
			})
		}
	} else {
		res.status(403).send({
			message: 'Wrong parameter values'
		})
	}
})

groupController.delete('/groups', async (req, res) => {
	const { id } = req.body

	if (id) {
		try {
			await groupModel.destroy({
				where: { id: id }
			})
			res.status(200).send({
				message: `Record deleted`
			})
		}
		catch (err) {
			res.status(418).send({
				message: `Could not delete record: ${error}`
			})
		}
	} else {
		res.status(403).send({
			message: 'Wrong parameter values'
		})
	}
})