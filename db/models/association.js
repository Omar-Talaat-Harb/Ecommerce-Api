module.exports = (db)=>{
const {Category , SubCategory , Brand ,Product} = db;

  Category.hasMany(SubCategory ,{foreignKey:'categoryId' ,onDelete:'CASCADE' ,onUpdate:'CASCADE'});
  SubCategory.belongsTo(Category,{foreignKey:'categoryId'});

  Category.hasMany(Product,{foreignKey:'categoryId'});
  Product.belongsTo(Category,{foreignKey:'categoryId'});

  SubCategory.hasMany(Product,{foreignKey:'subCategoryId'});
  Product.belongsTo(SubCategory,{foreignKey:'subCategoryId'});

  Brand.hasMany(Product,{foreignKey:'brandId'});
  Product.belongsTo(Brand,{foreignKey:'brandId'});
  
};