const multer = require('multer');
const AppError = require('./../utils/appError');


const multerOptions = () =>{
  // 1-DiskStorage engine
// const multerStorage = multer.diskStorage({
//   destination: function (req,file,cb){
//     cb(null, 'uploads/categories')
//   },
//   filename: function (req,file,cb){
//     // const ext = req.file.mimetype.split('/')[1];
//     const filename = `category-${Date.now()}-${file.originalname}`;
//     cb(null,filename)
//   },
// }) ; 

// 2- memory storage engine
const  multerStorage = multer.memoryStorage()


const multerFilter = function (req,file,cb){
  if(file.mimetype.startsWith('image')){
    cb(null,true)
  }else{
    cb(new AppError(`Only Images Allowed`,400),false)
  }
}

const upload = multer({storage: multerStorage ,fileFilter: multerFilter});
return upload ;
};

exports.uploadSingleImage = (fieldName)=>  multerOptions().single(fieldName);
;

exports.uploadMixOfImages = (arrayOfFields)=>  multerOptions().fields(arrayOfFields);


