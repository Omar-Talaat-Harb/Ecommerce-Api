const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize =require('./../../config/db');
const AppError = require('./../../utils/appError');




const User = sequelize.define('user',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
          notNull:'User Name cannot be null'
        },
        set(value){
          this.setDataValue('name',value.trim());
        }
      },
      email: {
        type: DataTypes.STRING,
        unique:{
          msg:'This Email already exists'
        },
        allowNull:false,
        validate:{
          notNull:'Email cannot be empty',
          isEmail:{
            msg:'invalid Email Address'
          }
        },
        set(value){
          this.setDataValue('email',value.toLowerCase());
        }
      },
      phone: {
        type: DataTypes.STRING
      },
      profileImg: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
          notNull:'Password cannot be null',
          len:{
            args:[6,50],
            msg:'password must be between 6 to 50 characters'
          }
        }
      },
      passwordConfirm:{
        type:DataTypes.VIRTUAL,
        validate:{
          notEmpty:{
            msg:'PasswordConfirm is required'
          }
        },
        set(value){
          if(value !== this.password){
            throw new AppError('password and PasswordConfirm must be identical',400);
          }
        }
      },
      role: {
        type: DataTypes.ENUM("user","admin"),
        defaultValue:"user",
        validate:{
          isIn:{
            args:[['user','admin']],
            msg:'in valid user role'
          }
        }
      }
    },{
      paranoid:true,
  hooks: {
    beforeUpdate: async (user, options) => {
      if (user.changed('password')) {
        const password = user.password; 
        user.setDataValue('password', await bcrypt.hash(password , 10));
        if (options && options.validate) {
          options.validate = false;
        }
      }
    },
    beforeCreate:async(user)=>{
      if(user.password){
        user.password = await bcrypt.hash(user.password, 10)
      }
    }
  }

    }
);

module.exports = User;