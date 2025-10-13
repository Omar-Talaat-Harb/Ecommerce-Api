'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull:false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull:false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      sold: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      price: {
        type: Sequelize.DECIMAL(8,2),
        allowNull:false
      },
      priceAfterDiscount:{
        type:Sequelize.DECIMAL
      },
      colors:{
        type:Sequelize.ARRAY(Sequelize.STRING)
      },
      image_cover:{
        type:Sequelize.STRING,
        allowNull:false
      },
      images:{
        type:Sequelize.ARRAY(Sequelize.STRING)
      },
      ratingsAverage:{
        type:Sequelize.DECIMAL(3,2)
      },
      ratingsQuantity:{
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      categoryId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"categories",
          key:"id"
        }
      },
      brandId:{
        type:Sequelize.INTEGER,
        references:{
          model:"brands",
          key:"id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};