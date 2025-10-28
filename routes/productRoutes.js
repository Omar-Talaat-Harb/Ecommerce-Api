const express = require('express');
const productController = require('./../controllers/productController');
const productValidator = require('./../utils/validators/productValidator');

const router = express.Router();


router.route('/')
.get(productController.getAllProducts)
.post(productController.uploadProductsImages,productController.resizeProductImages,
  productValidator.createProductValidator,productController.createProduct);

router.route('/:id')
.get(productValidator.getProductValidator,productController.getProduct)
.patch(productController.uploadProductsImages,productController.resizeProductImages,
  productValidator.updateProductValidator,productController.updateProduct)
.delete(productValidator.deleteProductValidator,productController.deleteProduct);








module.exports = router;