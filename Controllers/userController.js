import express from 'express'
import User from '../Models/userModel.js'
import Org from '../Models/orgModel.js'
import Group from '../Models/groupModel.js'
import UserGroupRel from '../Models/userGroupRelModel.js'
import { getAttributes, getLimit, getSortKey } from '../Utils/apiUtils.js'

export const userController = express.Router()

// Definerer relation mellem user og org - one to many
Org.hasMany(User)
User.belongsTo(Org)

// Definerer relation mellem user og usergroups - many to many
User.belongsToMany(Group, { through: UserGroupRel }, { onDelete: 'CASCADE' });
Group.belongsToMany(User, { through: UserGroupRel }, { onDelete: 'CASCADE' });

userController.get('/users', async (req, res) => {

	// Eksekverer sequelize metode med management values
	try {
		const result = await User.findAll({
			attributes: getAttributes(req, 'id, email'),
			order: getSortKey(req, 'id'),
			limit: getLimit(req),
			include: {
				model: Org,
				attributes: ['id', 'name']
			},
			include: {
				model: Group,
				attributes: ['id', 'name']
			}
		})
		// Udskriver resultat i json format
		res.json(result)
	} catch (error) {
		res.status(418).send({
			message: `Could not get user list: ${error}`
		})
	}
})

userController.get('/users/:id([0-9]*)', async (req, res) => {
	const { id } = req.params || 0

	if (id) {
		try {
			// Eksekverer sequelize metode med attributter og where clause
			const result = await User.findOne({
				attributes: [
					'id',
					'firstname',
					'lastname',
					'email',
					'is_active',
					'createdAt',
					'updatedAt'
				],
				where: { id: id }
			})
			// Udskriver resultat i json format
			res.json(result)
		} catch (error) {
			res.status(418).send({
				message: `Could not get user details: ${error}`
			})
		}
	} else {
		res.status(403).send({
			message: 'Wrong parameter values'
		})
	}
})

userController.post('/users', async (req, res) => {
	// Destructure assignment af form data fra request body
	const { firstname, lastname, email, password, org_id, refresh_token, groups } = req.body;

	// Tjekker felt data
	if (firstname && lastname && email && password && org_id) {

		try {
			// Opretter record
			const model = await User.create(req.body)

			if (groups) {
				groups.split(',').map(value => {
					const values = {
						group_id: +value,
						user_id: model.id
					}
					UserGroupRel.create(values)

				})
			}
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

userController.put('/users', async (req, res) => {
	const { id } = req.params
	// Destructure assignment af form data fra request body
	const { firstname, lastname, email, password, org_id, groups } = req.body;
	// Tjekker felt data
	if (id && firstname && lastname && email && password && org_id) {

		try {
			// Opretter record
			const model = await User.update(req.body, {
				where: { id: id },
				individualHooks: true
			})

			if (groups) {
				groups.split(',').map(value => {
					const values = {
						group_id: +value,
						user_id: model.id
					}
					UserGroupRel.create(values)

				})
			}
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

userController.delete('/users', async (req, res) => {
	const { id } = req.body

	try {
		await User.destroy({
			where: { id: id }
		})
		res.status(200).send({
			message: `Record deleted`
		})
	}
	catch (err) {
		res.status(403).send({
			message: 'Wrong parameter values'
		})
	}
})