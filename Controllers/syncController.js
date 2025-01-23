import express from 'express'
export const syncController = express.Router()
import sequelize from '../Config/sequelize.config.js'

import groupModel from '../Models/groupModel.js'
import orgModel from '../Models/orgModel.js'
import User from '../Models/userModel.js'
import UserGroupRel from '../Models/userGroupRelModel.js'
import tempModel from '../Models/tempModel.js'

syncController.get('/sync', async (req,res) => {
	//const seeder = new SeedController() 
	try {
		const resp = await sequelize.sync({ force: true })        
		//await seeder.seed_from_csv()
		res.send('Data succesfully synchronized')
        
	}
	catch(err) {
		res.send(err)
	}
})