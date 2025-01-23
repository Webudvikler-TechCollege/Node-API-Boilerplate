import sequelize from '../Config/sequelize.config.js'
import { DataTypes, Model } from 'sequelize'

export default class tempModel extends Model{}

tempModel.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'Ikke navngivet'
	},
	comment: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	date: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	is_published: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	}
}, {
	sequelize,
	modelName: 'temp',
	underscored: true,
})