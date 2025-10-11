const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validationMiddleware');


exports.getCategoryValidator = [  
check('id').isInt().withMessage('Invalid ID'),
validatorMiddleware
];

exports.createCategoryValidator =[
  check('name')
  .notEmpty().withMessage('category cannot be empty')
  .isLength({min:3,max:32}).withMessage('Category must be between 3 and 32 characters'),
  validatorMiddleware
];

exports.updateCategoryValidator = [  
check('id').isInt().withMessage('Invalid ID'),
validatorMiddleware
];

exports.deleteCategoryValidator = [  
check('id').isInt().withMessage('Invalid ID'),
validatorMiddleware
];