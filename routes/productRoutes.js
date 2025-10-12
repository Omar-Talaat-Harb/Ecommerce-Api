const express = require('express');
const productController = require('./../controllers/productController');
const productValidator = require('./../utils/validators/productValidator');

const router = express.Router();


router.route('/')
.get(productController.getAllProducts)
.post(productValidator.createProductValidator,productController.createProduct);

router.route('/:id')
.get(productValidator.getProductValidator,productController.getProduct)
.patch(productValidator.updateProductValidator,productController.updateProduct)
.delete(productValidator.deleteProductValidator,productController.deleteProduct);








module.exports = router;