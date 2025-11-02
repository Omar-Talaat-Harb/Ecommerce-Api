const crypto = require('crypto')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {User} = require('./../db/models');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/sendEmail');
const generateToken = require('./../utils/tokenGenerate')


// @DESC signup
// @route PUT/api/v1/auth/signup
// @access public
exports.singup = catchAsync(async (req,res,next)=>{
  //verify that email isn't exist
  const verifyEmail = await User.findOne({where:{email:req.body.email}});
  if(verifyEmail){
    return next(new AppError('This Email Already Exists please try again with Another Email',401))
  }
  //1- create user
  const user = await User.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm,
    phone:req.body.phone,
  });

    //2- generate token
  const token = (generateToken(user.id));  
  res.status(201).json({
    status:'success',
    data:user,
    token
  })
});

// @DESC login
// @route PUT/api/v1/auth/login
// @access public
exports.login = catchAsync(async(req,res,next)=>{
  //1) check if user exist & password is correct
  const user = await User.findOne({where:{email:req.body.email}});
  if(!user || !(await bcrypt.compare(req.body.password,user.password))){
    return next(new AppError('incorrect email or password',401));
  }
  //2) generate token
  const token = generateToken(user.id);
    res.status(200).json({
      data:user,
      token
    })
});

// @DESC middleware to protect route allow only authenticated users to access
exports.protect = catchAsync(async(req,res,next)=>{
  // 1) check if token exists 
  let token;
  if(!req.headers.authorization || !(req.headers.authorization.startsWith('Bearer'))){
    return next(new AppError('You are not Logged in , please login to access this route',401));
  }
  token = req.headers.authorization.split(' ')[1];
  // 2) verify token (no change happened , expires token)
  const decoded = jwt.verify(token,process.env.JWT_SECRET)
  // 3) check if user exist
  const currentUser = await User.findByPk(decoded.userId);
  if(!currentUser){
    return next(new AppError('The User that belong to this token no longer exist',401));
  }
  // 4) check if user change his password after token created
  if(currentUser.passwordChangedAt){
    const passChangedTime = parseInt(currentUser.passwordChangedAt.getTime()/1000,10);
    //password changed after token generated
    if(passChangedTime > decoded.iat){
      return next(new AppError('User recently changed password. please login again to get access',401));
    }
  }
  req.user = currentUser ;
  next();
});

//@DESC Authorization (user permissions)
exports.allowedTo = (...roles)=>((req,res,next)=>{
  //access roles
  //access registered user (req.user.role)
  if(!roles.includes(req.user.role)){
    return next(new AppError('You are not Allowed to Perform This Action',403));
  }
  next();
});

// @DESC forgot password
// @ROUTE POST /api/v1/auth/forgot-password
// @ACCESS public
exports.forgotPassword = catchAsync(async(req,res,next)=>{
  //1)Get user by email
  const user = await User.findOne({where:{email:req.body.email}});
  if(!user){
    return next(new AppError(`There Is No User With This Email: ${req.body.email}`,404));
  }
  //2) if user exists, generate random 6 digits and save it in DB
  const restCode = Math.floor(100000+ Math.random()* 900000).toString();
  const hashedRestCode= crypto.createHash('sha256').update(restCode).digest('hex');
  //save Hashed password reset code in DB 
  user.passwordResetCode = hashedRestCode;
  //Add expire time to the reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false
  await user.save();
  //3) send the rest code via email
  try {
    await sendEmail({
      email:user.email,
      subject:'your password reset code (valid for 10 minutes)',
      message:`Hi ${user.name} your password reset code is ${restCode}`
  });
  } catch (error) {
    user.passwordResetCode = null;
    user.passwordResetExpires = null;
    user.passwordResetVerified = null
    await user.save();
    return next(new AppError('there is an error in sending email',500));
  }

  res.status(200).json({
    status:'success',
    message:'reset code sent to email'
  });
  next();
});

// @DESC verify password reset code
// @ROUTE POST /api/v1/auth/verifyRestCode
// @ACCESS public 
exports.verifyPasswordRestCode = catchAsync(async(req,res,next)=>{
  //1) get user based on reset code
  const hashedRestCode= crypto.createHash('sha256')
  .update(req.body.resetCode).digest('hex');

  const user = await User.findOne({where:{passwordResetCode:hashedRestCode}});
  if(!user ||  user.passwordResetExpires < Date.now()){
    return next(new AppError('Reset code invalid or expired',400))
  }
  //2)reset code valid
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status:'success'
  })
});


// @DESC Reset password
// @ROUTE POST /api/v1/auth/resetPassword
// @ACCESS public 
exports.resetPassword = catchAsync(async(req,res,next)=>{
  const user = await User.findOne({where:{email:req.body.email}});
  if(!user){
    return next(new AppError(`there is no user with this Email ${req.body.email}`,404));
  }
  if(!user.passwordResetVerified){
    return next(new AppError('Reset code not verified',400))
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmPassword;
  user.passwordResetCode = null;
  user.passwordResetExpires = null;
  user.passwordResetVerified = null;
  await user.save();

  // generate a new token
  const token = generateToken(user.id);
  res.status(201).json({
    status:'success',
    token
  })

})
