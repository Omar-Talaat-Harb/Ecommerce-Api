const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validationMiddleware');


exports.getBrandValidator = [  
check('id').isInt().withMessage('Invalid ID'),
validatorMiddleware
];

exports.createBrandValidator =[
  check('name')
  .notEmpty().withMessage('Brand cannot be empty')
  .isLength({min:2,max:32}).withMessage('Brand must be between 3 and 32 characters'),
  validatorMiddleware
];

exports.updateBrandValidator = [  
check('id').isInt().withMessage('Invalid ID'),
validatorMiddleware
];

exports.deleteBrandValidator = [  
check('id').isInt().withMessage('Invalid ID'),
validatorMiddleware
];