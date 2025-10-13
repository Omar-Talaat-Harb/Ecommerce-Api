module.exports = (db)=>{
const {Category , SubCategory , Brand ,Product} = db;

  Category.hasMany(SubCategory ,{foreignKey:'categoryId' ,onDelete:'CASCADE' ,onUpdate:'CASCADE'});
  SubCategory.belongsTo(Category,{foreignKey:'categoryId'});

  Category.hasMany(Product,{foreignKey:'categoryId'});
  Product.belongsTo(Category,{foreignKey:'categoryId'});

  Product.belongsToMany(SubCategory,{
    through : 'productSubCategories',
    foreignKey : 'productId',
    otherKey: 'subCategoryId',
    onDelete: 'CASCADE'
  });

  SubCategory.belongsToMany(Product,{
  through : 'productSubCategories',
  foreignKey : 'subCategoryId',
  otherKey: 'productId',
  onDelete: 'CASCADE'
});

  Brand.hasMany(Product,{foreignKey:'brandId'});
  Product.belongsTo(Brand,{foreignKey:'brandId'});
  
};