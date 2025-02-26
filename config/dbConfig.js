// Import af dependencies
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

// Giver adgang til variabler fra en .env-fil via process.env
dotenv.config()

const dbConfig = new Sequelize(
	process.env.DBNAME,    // Databasens navn
	process.env.DBUSER,    // Brugernavn til databasen
	process.env.DBPASSWD,  // Adgangskode til databasen
	{
		host: process.env.DBHOST,  // Database-serverens adresse
		port: process.env.DBPORT,  // Porten databasen kører på
		dialect: 'mysql'           // Databasetype (MySQL)
	}
)

export default dbConfig