const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validationMiddleware');


exports.getUserValidator = [  
check('id').isNumeric().withMessage('Invalid ID'),
validatorMiddleware
];

exports.createUserValidator =[
  check('name')
    .notEmpty().withMessage('User cannot be empty')
    .isLength({min:2,max:32}).withMessage('User must be between 3 and 32 characters'),
  check('email')
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('invalid email address')
    .normalizeEmail({
      gmail_remove_dots: false, 
      gmail_remove_subaddress: false,
      all_lowercase: true, 
    })
  ,check('password')
    .notEmpty().withMessage('password is required')
    .isLength({min:6}).withMessage('Password must be at least 6 characters'),
  check('role').optional().isIn(['user','admin']).withMessage('invalid role'),
  check('phone').optional().isMobilePhone(["ar-EG","ar-SA"]).withMessage('Invalid phone number only accept EG and SA phone numbers'),
  check('passwordConfirm').notEmpty().withMessage('Password Confirm Required'),
  validatorMiddleware
];

exports.updateUserValidator = [  
  check('id').isNumeric().withMessage('Invalid ID'),
  check('name')
    .optional()
    .isLength({min:2,max:32}).withMessage('User must be between 3 and 32 characters'),
  check('email')
    .optional()
    .isEmail().withMessage('invalid email address')
    .normalizeEmail({
      gmail_remove_dots: false, 
      gmail_remove_subaddress: false,
      all_lowercase: true, 
    }),
  check('role').optional().isIn(['user','admin']).withMessage('invalid role'),  
  check('phone').optional().isMobilePhone(["ar-EG","ar-SA"]).withMessage('Invalid phone number only accept EG and SA phone numbers')
,validatorMiddleware
];

exports.changePasswordValidator = [
  check('id')
    .isNumeric()
    .withMessage('Invalid ID'),
  check('currentPassword')
    .notEmpty()
    .withMessage('u must enter your current password'),
  check('newPassword')
    .notEmpty()
    .withMessage('u must enter the new password'), 
  check('confirmPassword')
    .notEmpty()
    .withMessage('confirm password is required')
  ,validatorMiddleware
]

exports.deleteUserValidator = [  
check('id').isNumeric().withMessage('Invalid ID'),
validatorMiddleware
];