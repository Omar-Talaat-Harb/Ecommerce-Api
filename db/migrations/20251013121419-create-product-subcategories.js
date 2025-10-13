'use strict';

const { DATE } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('productSubCategories',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
      },
      productId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'products',
          key:'id'
        },
        onDelete:'CASCADE'
      },
      subCategoryId:{
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'subCategories',
          key:'id'
        },
        onDelete:'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('productSubCategories');
  }
};
