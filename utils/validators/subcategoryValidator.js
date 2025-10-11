const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validationMiddleware');


exports.getSubCategoryValidator = [  
check('id').isInt().withMessage('Invalid ID'),
validatorMiddleware
];

exports.createSubCategoryValidator =[
  check('name')
  .notEmpty().withMessage('SubCategory cannot be empty')
  .isLength({min:2,max:32}).withMessage('SubCategory must be between 3 and 32 characters'),
  check('categoryId').notEmpty().withMessage('Category Id is required')
  .isInt().withMessage('Invalid CategoryId'),
  validatorMiddleware
];

exports.updateSubCategoryValidator = [  
check('id').isInt().withMessage('Invalid ID'),
validatorMiddleware
];

exports.deleteSubCategoryValidator = [  
check('id').isInt().withMessage('Invalid ID'),
validatorMiddleware
];