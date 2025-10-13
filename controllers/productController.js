const slugify = require('slugify');
const {Op} = require('sequelize')
const {Product} = require('./../db/models');
const {Category ,SubCategory ,Brand} = require('./../db/models');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');




// @DESC get list of Products
// @route GET /api/v1/products
// @access pubic
exports.getAllProducts = catchAsync(async(req,res,next)=>{
    //search
    const queryObj = {...req.query};
    const excludedFields = ['page','sort','limit','fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    const where = {};
    for (let key in queryObj) {
      const value = queryObj[key];
      if(!isNaN(value)){ 
        where [key] = value 
      }else{
        where[key] = { [Op.iLike]: `%${queryObj[key]}%` }; // Postgres (case-insensitive)
      } 
    }
    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const offset = (page - 1) * limit;

    const sort = req.query.sort || 'createdAt';

  const {rows , count} = await Product.findAndCountAll({
    where,
    offset,limit,
    order:[[sort, 'DESC']]
    ,include:[
    {
      model:SubCategory,
      attributes:['id','name'],
      through:{attributes:[]},
    }
    ,{
      model:Category,
      attributes:['name']
    }
  ]
  });
  // const totalPages = Math.ceil(count/limit);
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
  const product = await Product.findOne({where:{id} ,include:[
    {
      model:SubCategory,
      attributes:['id','name'],
      through:{attributes:[]},
    }
    ,{
      model:Category,
      attributes:['name']
    }
  ]});
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
const { subCategories, ...productData } = req.body;
  productData.slug = slugify(productData.title);
  //check if the category is valid
  const categoryId = productData.categoryId;
  const prodCategory = await Category.findByPk(categoryId);
  if(!prodCategory){
    return next(new AppError(`there is no category with this id ${categoryId}`,404))
  }
  //check for subCategories if exists
  if (subCategories && subCategories.length > 0){
    const foundSubs = await SubCategory.findAll({where:{id:subCategories}});
    if(foundSubs.length !== subCategories.length){
      const missingIds = subCategories.filter(id=>!foundSubs.find(sub => sub.id === id))
      return next(new AppError(`some subCategories not found ${missingIds}`,400))
    }
    const invalidSubs = foundSubs.filter(sub=>sub.categoryId !== categoryId)
    if(invalidSubs.length> 0 ){
      return next(new AppError(`these subCategories:${invalidSubs.map(s=>s.id)} don't belong to this category`,400));
    }
  }
  if(productData.brandId){
    const brand = await Brand.findByPk(productData.brandId);
    if(!brand){
    return next(new AppError(`there is no brand with this id ${productData.brandId}`,404));
    }
  }

  const product = await Product.create(productData);

  //
  if(subCategories && subCategories.length > 0 ){
    await product.addSubCategories(subCategories);
  }
  res.status(201).json({
    message:'product created successfully',
    product
  })

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