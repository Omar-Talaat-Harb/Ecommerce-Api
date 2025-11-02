const sharp = require('sharp');
const bcrypt = require('bcrypt');
const {User} = require('./../db/models');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');
const { uploadSingleImage } = require('./../middlewares/uploadImageMiddleware');
const generateToken = require('./../utils/tokenGenerate')


//upload single img
exports.uploadUserImage = uploadSingleImage('profileImg');
//image processing
exports.resizeImage = catchAsync(async(req,res,next)=>{
  if(req.file){
    const fileName = `user-${Date.now()}-${req.file.originalname.split('.')[0]}.jpeg`;
    await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/users/${fileName}`);

      req.body.profileImg = fileName
  }
  next();
});

// @DESC get list of users
// @route GET /api/v1/users
// @access private
exports.getAllUsers = catchAsync(async(req,res,next)=>{
  const page = req.query.page * 1 || 1 ;
  const limit = req.query.limit * 1 || 5;
  const offset = (page-1)*limit

  const {rows , count} = await User.findAndCountAll({
    offset,limit
  });
  if(count == 0 ){
    return next(new AppError('No users found',404))
  }
  const totalPages = Math.ceil(count/limit);
  res.status(200).json({
    currentPage:page,
    results:rows.length,
    data:rows
  })
});

// @DESC get specific User
// @route GET /api/v1/users/:id
// @private public
exports.getUser= catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const user = await User.findByPk(id);
  if(!user){
    return next(new AppError(`there is no User with this id ${id}`,404))
  }
  res.status(200).json({
    result:user
  })
});

// @DESC create User
// @route POSt /api/v1/users
// @access private
exports.createUser= catchAsync(async(req,res,next)=>{
  const [user, created] = await User.findOrCreate({
  where: {email:req.body.email},
  defaults: req.body,
  paranoid: false, // include soft-deleted rows
});

if (created) {
  // create new user
  return res.status(201).json({
    status:'success',
    data:user
  });
}

if (!created && !user.deletedAt) {
  // active user already exists
  return next(new AppError('Email already exists', 400));
}

if (!created && user.deletedAt) {
  // deleted user then restore it
  await user.restore();
  return res.status(202).json({
    status:'account restored successfully',
    data:user
  });
}
});

// @DESC update specific User
// @route PATCH /api/v1/users/:id
// @access private
exports.updateUser = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const user = await User.findByPk(id);
  if(!user){
    return next(new AppError(`there is no User with this id ${id}`,404))
  }
  const updatedUser= await user.update({    
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    profileImg:req.body.profileImg,
    role:req.body.role});
  res.status(201).json({
    status:'success',
    result:updatedUser
  })
});

// @DESC change password
// @route PATCH /api/v1/users/change-password/:id
//@access private
exports.changeUserPassword = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const  password  = req.body.newPassword;

  const user = await User.findByPk(id);
  if(!user){
    return next(new AppError(`there is no User with this id ${id}`,404))
  }
  //verify the current password
  const confirmPass = await bcrypt.compare(req.body.currentPassword , user.password)
  if(!confirmPass){
    return next(new AppError('incorrect Current Password',401))
  }
  const updatedUser = await user.update({ 
    password : password,
    passwordConfirm :req.body.confirmPassword
  });
  res.status(201).json({
    message:'password updated successfully',
    data:updatedUser
  })
})

// @DESC delete specific User
// @route DELETE /api/v1/users/:id
// @access private
exports.deleteUser= catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const user = await User.destroy({where:{id}});
  if(!user){
    return next(new AppError(`there is no User with this id ${id}`,404))
  }
    res.status(204).send();
});

// @DESC get logged User data
// @route GET /api/v1/users/getMe
// @access private/protect
exports.getLoggedUser=(req,res,next)=>{
  req.params.id = req.user.id
  next();
}

// @DESC update logged User password
// @route PATCH /api/v1/users/updateMyPassword
// @access private/protect
exports.updateLoggedUserPass=catchAsync(async(req,res,next)=>{
  const id = req.user.id;
  const  password  = req.body.newPassword;

  const user = await User.findByPk(id);
  await user.update({ 
    password : password,
    passwordConfirm :req.body.confirmPassword
  });
  //generate token
  const token = generateToken(user.id);
  res.status(201).json({
    message:'password updated successfully',
    data:user,
    token
  })
});

// @DESC update logged User data
// @route PATCH /api/v1/users/updateMe
// @access private/protect
exports.updateLoggedUserData=catchAsync(async(req,res,next)=>{
  const id = req.user.id;
  const user = await User.findByPk(id);

  await user.update({    
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    profileImg:req.body.profileImg,
  });
  res.status(201).json({
    status:'success',
    result:user
  })
});

// @DESC delete logged User data
// @route DELETE /api/v1/users/deleteMe
// @access private/protect
exports.deleteMe = catchAsync(async(req,res,next)=>{
  const id = req.user.id;
  await User.destroy({where:{id}});
    res.status(204).send();
});
