const slugify = require('slugify');
const {Category} = require('./../db/models');
const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/appError');



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
  res.status(200).json({
    result:category
  })
})

// @DESC create category
// @route POSt /api/v1/categories
// @access private
exports.createCategory = catchAsync(async(req,res,next)=>{
    const {name} = req.body;

  //SequelizeUniqueConstraintError
  const slug = slugify(name);

  const category = await Category.create({
    name,
    slug
  });
  res.status(201).json({
    status:'success',
    data:category
  });
  //  error.errors[0].message

});


// @DESC update specific category
// @route PATCH /api/v1/categories/:id
// @access private
exports.updateCategory = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const {name} = req.body;
  const category = await Category.findByPk(id);
  if(!category){
    return next(new appError(`there is no category with this id ${id}`,404))
  }
  const slug =slugify(name);
  const updatedCategory = await category.update({
    name,
    slug
  });
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
      return next(new appError(`there is no category with this id ${id}`,404))
  }
    res.status(204).send();
});