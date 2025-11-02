const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
const productValidator = require('./../utils/validators/productValidator');


const router = express.Router();


router.route('/')
.get(productController.getAllProducts)

.post(authController.protect,authController.allowedTo('admin'),
productController.uploadProductsImages,productController.resizeProductImages,
  productValidator.createProductValidator,productController.createProduct);

router.route('/:id')
.get(productValidator.getProductValidator,productController.getProduct)

.patch(authController.protect,authController.allowedTo('admin'),
  productController.uploadProductsImages,productController.resizeProductImages,
  productValidator.updateProductValidator,productController.updateProduct)
  
.delete(authController.protect,authController.allowedTo('admin'),
productValidator.deleteProductValidator,productController.deleteProduct);








module.exports = router;