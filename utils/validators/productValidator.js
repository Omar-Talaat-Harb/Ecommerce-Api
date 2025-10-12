const {check} = require('express-validator');
const validatorMiddleware = require('./../../middlewares/validationMiddleware');

exports.getProductValidator = [
  check('id').isNumeric().withMessage('Invalid ID'),
  validatorMiddleware
];

exports.createProductValidator = [
  check('title')
    .notEmpty().withMessage('Product Title is required')
    .isLength({min:2,max:100}).withMessage('Product Title must be between 2 and 100'),
  check('description')
    .notEmpty().withMessage('Product description is required'),
  check('quantity')
    .notEmpty().withMessage('Product quantity is required'),
    check('sold')
      .optional()
      .isNumeric().withMessage('Product quantity must be number'),
  check('price')
    .notEmpty().withMessage('Product Price is required')
    .isNumeric().withMessage('invalid Datatype')
    .toFloat(),
  check('priceAfterDiscount')
    .optional()
    .isNumeric().withMessage('invalid Datatype')
    .toFloat()
    .custom((value, {req})=>{
      if(req.body.price <= value){
        throw new Error('priceAfterDiscount must be lower than price')
      }
      return true;
    }),
  check('colors')
    .optional()
    .isArray().withMessage('available Product colors should be array of string'),
  check('image_cover')
    .notEmpty().withMessage('Product Image is required'),
  check('images')
    .optional()
    .isArray().withMessage('Product images should be array of string'),
  check('ratingsAverage')
    .optional()
    .isNumeric().withMessage('invalid Datatype')
    .toFloat()
    .isLength({min:1,max:5}).withMessage('ratings must be between 1 and 5'),
  check('ratingsQuantity')
    .optional()
    .isNumeric().withMessage('invalid Datatype'),
  check('categoryId')
    .notEmpty().withMessage('Product must belong to category')
    .isNumeric().withMessage('invalid ID'),
  check('subCategoryId')
    .optional()
    .isNumeric().withMessage('invalid Id'),
  check('brandId')
    .optional()
    .isNumeric().withMessage('invalid Id'),
    validatorMiddleware
];

exports.updateProductValidator = [
  check('id').isNumeric().withMessage('Invalid ID'),
  validatorMiddleware
];

exports.deleteProductValidator = [
  check('id').isNumeric().withMessage('Invalid ID'),
  validatorMiddleware
];