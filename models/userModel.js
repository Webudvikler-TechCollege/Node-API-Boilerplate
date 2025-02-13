import sequelize from "../config/sequelizeConfig.js"
import { DataTypes, Model } from "sequelize"
import bcrypt from "bcrypt"

export class userModel extends Model {}

userModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "user",
    underscored: true,
    hooks: {
      beforeCreate: async (user, options) => {
        user.password = await createHash(user.password)
      },
      beforeUpdate: async (user, options) => {
        user.password = await createHash(user.password)
      },
    },
  }
)

userModel.addHook('beforeBulkCreate', async (users) => {
  // Krypter hver adgangskode før bulkCreate-operationen
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

const createHash = async (string) => {
  const salt = await bcrypt.genSalt(10)
  const hashed_string = await bcrypt.hash(string, salt)
  return hashed_string
}