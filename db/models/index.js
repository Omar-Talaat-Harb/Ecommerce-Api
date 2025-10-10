const sequelize = require('./../../config/db');
const Category = require('./category')



const defineAssociation =require('./association');


module.exports = {sequelize , Category};