const bcrypt = require('bcrypt');
const {User} = require('./../db/models');
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');


const generateToken= (payload)=>{
    return jwt.sign({userId:payload},process.env.JWT_SECRET,
    {expiresIn : process.env.JWT_EXPIRES_TIME});
};
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
})