import express from 'express'
import { tempModel } from '../Models/tempModel.js'
export const tempController = express.Router()

/**
 * Controller for temp module
 */

tempController.get('/temp', async (req, res) => {
	try {
		const result = await tempModel.findAll({
			attributes: getAttributes(req, 'id, title'),
			order: getSortKey(req, 'id'),
			limit: getLimit(req),
		})
		// Udskriver resultat i json format
		res.json(result)
	} catch (error) {
		res.status(418).send({
			message: `Could not get data list: ${error}`
		})
	}
})

tempController.get('/temp/:id([0-9]*)', async (req, res) => {
	const { id } = req.params || 0

	if (id) {
		try {
			// Eksekverer sequelize metode med attributter og where clause
			const result = await tempModel.findOne({
				attributes: ['*'],
				where: { id: id }
			})
			// Udskriver resultat i json format
			res.json(result)

		} catch (error) {
			res.status(418).send({
				message: `Could not get detail data: ${error}`
			})
		}
	} else {
		res.status(403).send({
			message: 'Wrong parameter values'
		})
	}
})

tempController.post('/temp', async (req, res) => {
	const { title, comment, date, is_published } = req.body;

	if (title && comment && date && is_published) {
		try {
			const model = await tempModel.create(req.body)
			return res.json({
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

tempController.put('/temp', async (req, res) => {
	const { id } = req.params || 0
	const { name, address, zipcode, city, country } = req.body;

	if (id && name && address && zipcode && city) {
		try {
			const model = await tempModel.update(req.body, {
				where: { id: id },
				individualHooks: true
			})
			return res.json({
				message: `Record updated`
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

tempController.delete('/temp', async (req, res) => {
	const { id } = req.body

	if (id) {
		try {
			await tempModel.destroy({
				where: { id: id }
			})
			return res.status(200).send({
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