const express = require('express');

const userController = require('./../controllers/userController');
const userValidator = require('./../utils/validators/userValidator');

const router = express.Router();

router.route('/')
.get(userController.getAllUsers)
.post(userController.uploadUserImage,userController.resizeImage,
  userValidator.createUserValidator,userController.createUser);

router.patch('/change-password/:id'
  ,userValidator.changePasswordValidator,userController.changeUserPassword);


router.route('/:id')
.get(userValidator.getUserValidator,userController.getUser)
.patch(userController.uploadUserImage,userController.resizeImage,
  userValidator.updateUserValidator,userController.updateUser)
.delete(
  userValidator.deleteUserValidator,userController.deleteUser);


module.exports = router