import sequelize from "../Config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import userModel from "./userModel.js";
import groupModel from "./groupModel.js";

export default class userGroupRelModel extends Model{}

userGroupRelModel.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	group_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: groupModel,
			key: 'id'
		}	
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: userModel,
			key: 'id'
		}	
	}
}, {
	sequelize,
	modelName: 'user_group_rel',
	freezeTableName: true,
	timestamps: false,
	underscored: true
})