const express = require('express');

const authController = require('./../controllers/authController');
const authValidator = require('./../utils/validators/authValidator');

const router = express.Router();

router.route('/signup').post(authValidator.signupValidator,authController.singup);

router.route('/login').post(authValidator.loginValidator,authController.login);  


module.exports = router