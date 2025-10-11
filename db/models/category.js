const {DataTypes} = require('sequelize');
const sequelize = require('./../../config/db');


const Category = sequelize.define('category',{
  id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull:false,
        unique:{
          msg:'this category already exists '
        },
        validate:{
          notNull:{
            msg:`category can't be null`
          },
          len:{
            args:[3,32],
            msg:'category need to be at least 3 letters long'
          }
        }
      },
      slug: {
        type: DataTypes.STRING,
        set(value){
          this.setDataValue('slug',value.toLowerCase());
        }
      },
      image:{
        type:DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
});

module.exports = Category;