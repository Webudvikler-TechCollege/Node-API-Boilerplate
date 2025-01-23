import sequelize from '../Config/sequelize.config.js'
import { DataTypes, Model } from 'sequelize'

export default class orgModel extends Model {}

orgModel.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	address: {
		type: DataTypes.STRING,
		allowNull: false
	},
	zipcode: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	city: {
		type: DataTypes.STRING,
		allowNull: false
	},
	country: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false
	},
	phone: {
		type: DataTypes.STRING,
		allowNull: false
	},
	longtitude: {
		type: DataTypes.DOUBLE,
		allowNull: true
	},
	latitude: {
		type: DataTypes.DOUBLE,
		allowNull: true
	}
},{
	sequelize,
	modelName: 'org',
	underscored: true
})