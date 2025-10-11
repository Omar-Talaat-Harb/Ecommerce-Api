const express = require('express');

const brandController = require('./../controllers/brandController');
const brandValidator = require('./../utils/validators/brandValidator');

const router = express.Router();

router.route('/')
.get(brandController.getAllBrands)
.post(brandValidator.createBrandValidator,brandController.createBrand);

router.route('/:id')
.get(brandValidator.getBrandValidator,brandController.getBrand)
.patch(brandValidator.updateBrandValidator,brandController.updateBrand)
.delete(brandValidator.deleteBrandValidator,brandController.deleteBrand);



module.exports = router