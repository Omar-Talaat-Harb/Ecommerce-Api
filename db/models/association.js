module.exports = (db)=>{
const {Category , SubCategory} = db;

  Category.hasMany(SubCategory ,{foreignKey:'categoryId' ,onDelete:'CASCADE' ,onUpdate:'CASCADE'});
  SubCategory.belongsTo(Category,{foreignKey:'categoryId'});

  
};