const slugify = require('slugify');
const {Category} = require('./../db/models');
const {SubCategory} = require('./../db/models');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');


// Nested Route
// @route GET /api/v1/categories/:id/subcategories
// @access public



// @DESC get list of subcategories
// @route GET /api/v1/subcategories
// @access pubic
exports.getAllSubCategories = catchAsync(async(req,res,next)=>{
  const page = req.query.page * 1 || 1 ;
  const limit = req.query.limit * 1 || 5;
  const offset = (page-1)*limit

  //checking if user sent any id for specific category
  let filterObj = {};
  if(req.params.categoryId){
    filterObj = {categoryId : req.params.categoryId}
  }
  
  const {rows , count} = await SubCategory.findAndCountAll({
    // attributes:{exclude:['categoryId']},
    offset,limit,
    where : filterObj

  });
  if(count == 0 ){
    return next(new AppError('No SubCategories found',404))
  }
  const totalPages = Math.ceil(count/limit);
  res.status(200).json({
    currentPage:page,
    results:rows.length,
    data:rows
  })
});


// @DESC get specific subcategory
// @route GET /api/v1/subcategories/:id
// @access public
exports.getSubCategory = catchAsync(async(req,res,next)=>{

  const {id} = req.params;
  const subcategory = await SubCategory.findByPk(id);
    // {where:{id},
    // attributes:{exclude:['categoryId']},
    // include:{model:Category,attributes:['name']}});
  if(!subcategory){
    return next(new AppError(`there is no subcategory with this id ${id}`,404))
  }
  res.status(200).json({
    result:subcategory
  })
});


// @DESC create subcategory
// @route POSt /api/v1/subcategories
// @access private
exports.createSubCategory = catchAsync(async(req,res,next)=>{
  const {name} = req.body;
  // priority here is for the categoryId sent in body on the in the params as website requirements
  const categoryId = req.body.categoryId || req.params.categoryId;
  const category = await Category.findByPk(categoryId);
  if(!category){
    return next(new AppError('Category not found',404));
  }
  const slug = slugify(name);
  const subcategory = await SubCategory.create({
    name,
    slug,
    categoryId
  });
  res.status(201).json({
    status:'success',
    data:subcategory
  });
});

// @DESC update specific subcategory
// @route PATCH /api/v1/subcategories/:id
// @access private
exports.updateSubCategory = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const {name , categoryId} = req.body;
  const subcategory = await SubCategory.findByPk(id);
  if(!subcategory){
    return next(new AppError(`there is no subcategory with this id ${id}`,404));
  }
  const slug =slugify(name);
  const updatedSubCategory = await subcategory.update({
    name,
    slug,
    categoryId
  });
  res.status(201).json({
    result:updatedSubCategory
  })
});


// @DESC delete specific subcategory
// @route DELETE /api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const category = await SubCategory.destroy({where:{id}});
  if(!category){
    return next(new AppError(`there is no category with this id ${id}`,404))
  }
    res.status(204).send();
});