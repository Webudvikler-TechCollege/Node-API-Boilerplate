import express from 'express'
import Org from '../Models/orgModel.js'
import { getAttributes, getLimit, getSortKey } from '../Utils/apiUtils.js'

/**
 * Controller for Org Actions
 */

export const orgController = express.Router()

orgController.get('/orgs', async (req, res) => {
	// Eksekverer sequelize metode med management values
	try {
		const result = await Org.findAll({
			attributes: getAttributes(req, 'id, email'),
			order: getSortKey(req, 'id'),
			limit: getLimit(req),
		})
		// Udskriver resultat i json format
		res.json(result)
	} catch (error) {
		res.status(418).send({
			message: `Could not get api list: ${error}`
		})
	}
})

orgController.get('/orgs/:id([0-9]*)', async (req, res) => {
	// Destructure assignment af id. 
	const { id } = req.params || 0

	if (id) {
		try {
			// Eksekverer sequelize metode med attributter og where clause
			const result = await Org.findOne({
				attributes: [
					'id',
					'name',
					'address',
					'zipcode',
					'city',
					'country',
					'longtitude',
					'latitude',
					'createdAt',
					'updatedAt'
				],
				where: { id: id }
			})
			// Udskriver resultat i json format
			res.json(result)

		} catch (error) {
			res.status(418).send({
				message: `Could not get org details: ${error}`
			})
		}
	} else {
		res.status(403).send({
			message: 'Wrong parameter values'
		})
	}
})

orgController.post('/orgs', async (req, res) => {
	// Destructure assignment af form data fra request body
	const { name, address, zipcode, city, country } = req.body;
	// Tjekker felt data
	if (name && address && zipcode && city) {
		try {
			// Opretter record
			const model = await Org.create(req.body)
			// Sender nyt id som json object
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

orgController.put('/Orgs', async (req, res) => {
	// Destructure assignment af id. 
	const { id } = req.params || 0
	// Destructure assignment af form data fra request body
	const { name, address, zipcode, city, country } = req.body;

	// Tjekker felt data
	if (id && name && address && zipcode && city) {

		try {
			// Opretter record
			const model = await Org.update(req.body, {
				where: { id: id },
				individualHooks: true
			})
			// Sender nyt id som json object
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

orgController.delete('/orgs', async (req, res) => {
	const { id } = req.body

	if (id) {
		try {
			await Org.destroy({
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