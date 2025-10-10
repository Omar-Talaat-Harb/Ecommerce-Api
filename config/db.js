require('dotenv').config({ path: __dirname + '/../config.env' });

const {Sequelize} = require('sequelize')
let env = process.env.NODE_ENV || 'development';
// env = env.trim();
const config = require('./config')


const sequelize = new Sequelize(config[env]);


module.exports = sequelize;

