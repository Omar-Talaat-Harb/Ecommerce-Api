const express = require('express');

const authController = require('./../controllers/authController');
const authValidator = require('./../utils/validators/authValidator');

const router = express.Router();

router.post('/signup',authValidator.signupValidator,authController.singup);

router.post('/login',authValidator.loginValidator,authController.login);  

router.post('/forgot-password',authController.forgotPassword);

router.post('/verifyRestCode',authController.verifyPasswordRestCode);

router.post('/resetPassword',authController.resetPassword);

module.exports = router