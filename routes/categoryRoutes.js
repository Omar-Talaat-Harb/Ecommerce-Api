const express = require('express');


const categoryController = require('./../controllers/categoryController');
const subCategoryRoutes = require('./subCategoryRoutes')
const categoryValidators = require('./../utils/validators/categoryValidators');

const router = express.Router();

//nested Route
router.use('/:categoryId/subcategories',subCategoryRoutes)

router.route('/')
.get(categoryController.getAllCategories)
.post(categoryController.uploadCategoryImage,categoryController.resizeImage
  ,categoryValidators.createCategoryValidator,categoryController.createCategory);

router.route('/:id')
.get(categoryValidators.getCategoryValidator,categoryController.getCategory)
.patch(categoryController.uploadCategoryImage,categoryController.resizeImage
  ,categoryValidators.updateCategoryValidator,categoryController.updateCategory)
.delete(categoryValidators.deleteCategoryValidator,categoryController.deleteCategory);


module.exports = router;