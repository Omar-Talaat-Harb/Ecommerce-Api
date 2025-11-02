const slugify = require('slugify');
const {Category} = require('./../db/models');
const sharp = require('sharp');

const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');
const { uploadSingleImage } = require('./../middlewares/uploadImageMiddleware')

// upload single image
exports.uploadCategoryImage = uploadSingleImage('image');
//image processing
exports.resizeImage = catchAsync(async (req,res,next)=>{
  if(req.file){
  const imageFormat = 'jpeg';
  const filename = `category-${Date.now()}-${req.file.originalname.split('.')[0]}.${imageFormat}`;
  await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat(imageFormat)
    .jpeg({quality:90})
    .toFile(`uploads/categories/${filename}`);
  //save image into our dp
  req.body.image = filename;
  }
  next();
});  

// @DESC get list of categories
// @route GET /api/v1/categories
// @access pubic
exports.getAllCategories = catchAsync(async(req,res,next)=>{
  const page = req.query.page * 1 || 1 ;
  const limit = req.query.limit * 1 || 5;
  const offset = (page-1)*limit
  const {rows , count} = await Category.findAndCountAll({
    offset,limit
  });
  const totalPages = Math.ceil(count/limit);
  res.status(200).json({
    totalPages,
    currentPage:page,
    results:rows.length,
    data:rows
  })
});


// @DESC get specific category
// @route GET /api/v1/categories/:id
// @access public
exports.getCategory = catchAsync(async(req,res,next)=>{

  const {id} = req.params;
  const category = await Category.findByPk(id);
  if(!category){
    return next(new AppError(`there is no category with this id ${id}`,404))
  }
  res.status(200).json({
    result:category
  })
})

// @DESC create category
// @route POSt /api/v1/categories
// @access private
exports.createCategory = catchAsync(async(req,res,next)=>{
    // const {name} = req.body;
  // console.log(req.file);
  
  const slug = slugify(req.body.name);
  req.body.slug = slug
  const category = await Category.create(req.body);
  res.status(201).json({
    status:'success',
    data:category
  });

});


// @DESC update specific category
// @route PATCH /api/v1/categories/:id
// @access private
exports.updateCategory = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const category = await Category.findByPk(id);
  if(!category){
    return next(new AppError(`there is no category with this id ${id}`,404))
  }
  if(req.body.name){
      req.body.slug = slugify(req.body.name);
  }
  const updatedCategory = await category.update(req.body);
  res.status(201).json({
    result:updatedCategory
  })
});


// @DESC delete specific category
// @route DELETE /api/v1/categories/:id
// @access private
exports.deleteCategory = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const category = await Category.destroy({where:{id}});
  if(!category){
    return next(new AppError(`there is no category with this id ${id}`,404))
  }
    res.status(204).send();
});