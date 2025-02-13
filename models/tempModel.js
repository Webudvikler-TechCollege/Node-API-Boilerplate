import sequelize from "../config/sequelizeConfig.js"
import { DataTypes, Model } from "sequelize"

export class tempModel extends Model { }

tempModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    validate: {
      len: { args: [4], msg: "Zipcode must be 4 characters long" },
      isNumeric: { msg: "Zipcode must only contain numbers" }
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Ikke navngivet',
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
},
  {
    sequelize,
    modelName: "temp",
    // underscored: true,
    // freezeTableNames: true,

  }
)