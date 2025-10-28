const {DataTypes} = require('sequelize');
const sequelize =require('./../../config/db');

const Product = sequelize.define('product',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
          len:{
            args:[2,100],
            msg:'Product Title must be between 2 and 100 '
          },
          notNull:'Product Title cannot be null',
          notEmpty:'Product Title cannot be empty'
        },
        set(value){
          this.setDataValue('title',value.trim());
        }
      },
      slug: {
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
          notEmpty:'Product slug cannot be empty'
        },
        set(value){
          this.setDataValue('slug',value.toLowerCase());
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull:false,
        validate:{
          notNull:'Product description cannot be null',
          notEmpty:'Product description cannot be empty'          
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull:false,
        validate:{
          notNull:'Product quantity cannot be null',
          notEmpty:'Product quantity cannot be empty'          
        }
      },
      sold: {
        type: DataTypes.INTEGER,
        defaultValue:0
      },
      price: {
        type: DataTypes.DECIMAL(8,2),
        allowNull:false,
        validate:{
          notNull:'Product Price cannot be null',
          notEmpty:'Product Price cannot be empty'          
        }
      },
      priceAfterDiscount:{
        type:DataTypes.DECIMAL
      },
      colors:{
        type:DataTypes.ARRAY(DataTypes.STRING)
      },
      image_cover:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
          notNull:'Product Image cannot be null',
          notEmpty:'Product Image cannot be empty'          
        },
        get(){
          const image = this.getDataValue('image_cover')
          //return set image base url + image name
          if(image){
            const imageUrl = `${process.env.BASE_URL}/products/${image}`
            return imageUrl
          }
        }
      },
      images:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        get(){
          const images = this.getDataValue('images')
          //return set image base url + image name
          if(images){
            const imagesUrl = images.map(img=>`${process.env.BASE_URL}/products/${img}`)
            return imagesUrl
          }
        }
      },
      ratingsAverage:{
        type:DataTypes.DECIMAL(3,2),
        validate:{
          len:{
            args:[1,5],
            msg:'ratings must be between 1 and 5'
          }
        }
      },
      ratingsQuantity:{
        type:DataTypes.INTEGER,
        defaultValue:0
      },
      categoryId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
          model:"categories",
          key:"id"
        },
        validate:{
          notNull:'Product Category cannot be null',
          notEmpty:'Product Category cannot be empty'          
        }
      },
      brandId:{
        type:DataTypes.INTEGER,
        references:{
          model:"brands",
          key:"id"
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
module.exports = Product;