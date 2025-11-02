const Category = require('./category');
const SubCategory = require('./subcategory');
const Brand = require('./brand');
const Product = require('./product');
const User = require('./user');



const defineAssociation =require('./association');

defineAssociation({Category,SubCategory,Product,Brand});


module.exports = { Category , SubCategory , Brand , Product , User};