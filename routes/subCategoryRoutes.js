const express= require('express');

const subCategoryController = require('./../controllers/subCategoryController');
const authController = require('./../controllers/authController');

const subCategoryValidator = require('./../utils/validators/subcategoryValidator');


//mergeParams allow us to access parameters that exist in another routes
const router = express.Router({mergeParams: true});


router.route('/')
.get(subCategoryController.getAllSubCategories) //according to the id they return in the category route
.post(authController.protect,authController.allowedTo('admin'),
  subCategoryValidator.createSubCategoryValidator,subCategoryController.createSubCategory);


router.route('/:id')
.get(subCategoryValidator.getSubCategoryValidator,subCategoryController.getSubCategory)

.patch(authController.protect,authController.allowedTo('admin'),
subCategoryValidator.updateSubCategoryValidator,subCategoryController.updateSubCategory)

.delete(authController.protect,authController.allowedTo('admin'),
subCategoryValidator.deleteSubCategoryValidator,subCategoryController.deleteSubCategory);


module.exports = router