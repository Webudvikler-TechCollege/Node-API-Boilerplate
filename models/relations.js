import { userModel } from "./userModel.js"
import { exampleModel } from "./exampleModel.js"

export const Relations = () => {
    exampleModel.belongsTo(userModel, { foreignKey: 'user_id', as: 'user' })
    userModel.hasMany(exampleModel, { foreignKey: 'user_id', as: 'examples' })
}