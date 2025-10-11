const sequelize = require('./../../config/db');
const Category = require('./category');
const SubCategory = require('./subcategory');



const defineAssociation =require('./association');

defineAssociation({Category,SubCategory});


module.exports = {sequelize , Category , SubCategory};