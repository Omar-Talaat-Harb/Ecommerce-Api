const express = require('express');

const brandController = require('./../controllers/brandController');
const authController = require('./../controllers/authController');
const brandValidator = require('./../utils/validators/brandValidator');

const router = express.Router();

router.route('/')
.get(brandController.getAllBrands)

.post(authController.protect,authController.allowedTo('admin'),
brandController.uploadBrandImage,brandController.resizeImage,
  brandValidator.createBrandValidator,brandController.createBrand);

router.route('/:id')
.get(brandValidator.getBrandValidator,brandController.getBrand)

.patch(authController.protect,authController.allowedTo('admin'),
brandController.uploadBrandImage,brandController.resizeImage,
  brandValidator.updateBrandValidator,brandController.updateBrand)
  
.delete(authController.protect,authController.allowedTo('admin'),
brandValidator.deleteBrandValidator,brandController.deleteBrand);



module.exports = router