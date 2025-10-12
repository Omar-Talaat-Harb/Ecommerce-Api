const slugify = require('slugify');
const {Product} = require('./../db/models');
const {Category ,SubCategory ,Brand} = require('./../db/models');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');



// @DESC get list of Products
// @route GET /api/v1/products
// @access pubic
exports.getAllProducts = catchAsync(async(req,res,next)=>{
  const page = req.query.page * 1 || 1 ;
  const limit = req.query.limit * 1 || 5;
  const offset = (page-1)*limit
  const {rows , count} = await Product.findAndCountAll({
    offset,limit,include:{
      model:Category,
      attributes:['name']
    }
  });
  const totalPages = Math.ceil(count/limit);
  res.status(200).json({
    currentPage:page,
    results:rows.length,
    data:rows
  })
});


// @DESC get specific Product
// @route GET /api/v1/products/:id
// @access public
exports.getProduct = catchAsync(async(req,res,next)=>{

  const {id} = req.params;
  const product = await Product.findOne({where:{id} ,include:{
      model:Category,
      attributes:['name']
    }});
  if(!product){
    return next(new AppError(`there is no product with this id ${id}`,404))
  }
  res.status(200).json({
    result:product
  })
})

// @DESC create Product
// @route POSt /api/v1/products
// @access private
exports.createProduct = catchAsync(async(req,res,next)=>{
  req.body.slug = slugify(req.body.title);
  const category = await Category.findByPk(req.body.categoryId);
  if(!category){
    return next(new AppError(`there is no category with this id ${req.body.categoryId}`,404));
  }
  if(req.body.subCategoryId){
    const subcategory = await SubCategory.findOne({where:{
      id:req.body.subCategoryId , 
      categoryId:req.body.categoryId}
    });
    if(!subcategory){
    return next(new AppError(`there is no subcategory with this id ${req.body.subCategoryId}`,404));
    }
  }
  if(req.body.brandId){
    const brand = await Brand.findByPk(req.body.brandId);
    if(!brand){
    return next(new AppError(`there is no brand with this id ${req.body.brandId}`,404));
    }
  }

  const product = await Product.create(req.body);
  res.status(201).json({
    status:'success',
    data:product
  });

});


// @DESC update specific Product
// @route PATCH /api/v1/products/:id
// @access private
exports.updateProduct = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const product = await Product.findByPk(id);
  if(!product){
    return next(new AppError(`there is no Product with this id ${id}`,404))
  }
  if(req.body.title){
    req.body.slug =slugify(req.body.title);
  }
  const updatedProduct = await product.update(req.body);
  res.status(201).json({
    result:updatedProduct
  })
});


// @DESC delete specific Product
// @route DELETE /api/v1/products/:id
// @access private
exports.deleteProduct = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const product = await Product.destroy({where:{id}});
  if(!product){
    return next(new AppError(`there is no Product with this id ${id}`,404))
  }
    res.status(204).send();
});