const {DataTypes} = require('sequelize');
const sequelize = require('./../../config/db');

const SubCategory = sequelize.define('subCategory',{
  id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name:{
        type:DataTypes.STRING,
        unique:{
          msg:'SubCategory must be unique'
        },
        allowNull:false,
        validate:{
          notEmpty:'SubCategory cannot be empty',
          len:{
            args:[2,32],
            msg:'SubCategory must be between 2 and 32 characters'
          },
        },
        set(value){
          this.setDataValue('name',value.trim());
        }
      },
      slug:{
        type:DataTypes.STRING,
        set(value){
          this.setDataValue('slug',value.toLowerCase())
        }
      },
      categoryId:{
        type:DataTypes.INTEGER,
        references:{
          model:'categories',
          key:'id'
        },
        allowNull: false,
        validate:{
          notNull:'CategoryId is required',
          notEmpty:'CategoryId cannot be empty'
        }
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

module.exports = SubCategory;