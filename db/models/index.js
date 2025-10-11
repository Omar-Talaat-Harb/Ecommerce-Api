const sequelize = require('./../../config/db');
const Category = require('./category');
const SubCategory = require('./subcategory');
const Brand = require('./brand');



const defineAssociation =require('./association');

defineAssociation({Category,SubCategory});


module.exports = {sequelize , Category , SubCategory , Brand};