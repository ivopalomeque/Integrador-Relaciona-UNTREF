const { Sequelize } = require('sequelize')
const dotenv = require ('dotenv')
const ENV = process.env.NODE_ENV || 'local'
dotenv.config({path: `.env.${ENV}` })

const { DBUSER, PASSWORD, HOST, DATABASE, DB_PORT } = process.env

const sequelize = new Sequelize(DATABASE, DBUSER, PASSWORD, {
  host: HOST,
  dialect: 'mysql',
  port: DB_PORT,  
})

module.exports = { sequelize }
    