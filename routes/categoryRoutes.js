const express = require('express');
const categoryController = require('./../controllers/categoryController');
const subCategoryRoutes = require('./subCategoryRoutes')
const categoryValidators = require('./../utils/validators/categoryValidators');

const router = express.Router();

//nested Route
router.use('/:categoryId/subcategories',subCategoryRoutes)

router.route('/')
.get(categoryController.getAllCategories)
.post(categoryValidators.createCategoryValidator,categoryController.createCategory);

router.route('/:id')
.get(categoryValidators.getCategoryValidator,categoryController.getCategory)
.patch(categoryValidators.updateCategoryValidator,categoryController.updateCategory)
.delete(categoryValidators.deleteCategoryValidator,categoryController.deleteCategory);


module.exports = router;