import sequelize from "../config/sequelizeConfig.js"
import { DataTypes, Model } from "sequelize"
import { userModel } from "./userModel.js"

// Definerer en klasse, der udvider Sequelize's Model-klasse
export class exampleModel extends Model { }

// Initialiserer modellen med felter og deres datatyper
exampleModel.init({
  // Primær nøgle: Automatisk incrementerende ID
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  // String-felt med en standardværdi og længdevalidering
  string_field: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Default String',
    validate: {
      len: { args: [5, 100], msg: "String must be between 5 and 100 characters" },
    }
  },
  // Tekstfelt uden krav om værdi
  text_field: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Dato-felt med validering for at sikre en gyldig dato
  date_field: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { msg: "Must be a valid date" }
    }
  },
  // Boolean-felt med en standardværdi på false
  boolean_field: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  // Integer-felt med minimums- og maksimumsvalidering
  integer_field: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "Must be an integer" },
      min: { args: [0], msg: "Must be at least 0" },
      max: { args: [1000], msg: "Must be at most 1000" }
    }
  },
  // Float-felt med validering for at sikre en numerisk værdi
  float_field: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: { msg: "Must be a float" }
    }
  },
  // Bruger relation
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: userModel,
      key: 'id'
    }
  },
},
  {
    sequelize, // Sequelize-forbindelsen
    modelName: "example", // Navn på modellen
    timestamps: true, // Tilføjer createdAt og updatedAt felter
    underscored: true, // Bruger underscoring i stedet for camelCase i kolonnenavne
    freezeTableName: true, // Forhindrer Sequelize i at ændre tabelnavnet
    indexes: [
      { unique: true, fields: ['string_field'] } // Sikrer unikke værdier i string_field
    ]
  }
)

