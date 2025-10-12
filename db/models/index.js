const sequelize = require('./../../config/db');
const Category = require('./category');
const SubCategory = require('./subcategory');
const Brand = require('./brand');
const Product = require('./product');



const defineAssociation =require('./association');

defineAssociation({Category,SubCategory,Product,Brand});


module.exports = {sequelize , Category , SubCategory , Brand , Product};