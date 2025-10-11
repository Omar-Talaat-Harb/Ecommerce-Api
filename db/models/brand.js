const {DataTypes} = require('sequelize');
const sequelize =require('./../../config/db');


const Brand = sequelize.define('brand',{
        id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name:{
        type:DataTypes.STRING,
        unique:{
          msg:'Brand must be unique'
        },
        allowNull:false,
        validate:{
          notEmpty:'Brand cannot be empty',
          len:{
            args:[2,32],
            msg:'Brand must be between 2 and 32 characters'
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
      image: {
        type: DataTypes.STRING
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

module.exports = Brand;