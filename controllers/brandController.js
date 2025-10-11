const slugify = require('slugify');
const {Brand} = require('./../db/models');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');




// @DESC get list of brands
// @route GET /api/v1/brands
// @access pubic
exports.getAllBrands = catchAsync(async(req,res,next)=>{
  const page = req.query.page * 1 || 1 ;
  const limit = req.query.limit * 1 || 5;
  const offset = (page-1)*limit

  const {rows , count} = await Brand.findAndCountAll({
    offset,limit
  });
  if(count == 0 ){
    return next(new AppError('No Brand found',404))
  }
  const totalPages = Math.ceil(count/limit);
  res.status(200).json({
    currentPage:page,
    results:rows.length,
    data:rows
  })
});


// @DESC get specific Brand
// @route GET /api/v1/brands/:id
// @access public
exports.getBrand = catchAsync(async(req,res,next)=>{

  const {id} = req.params;
  const brand = await Brand.findByPk(id);
  if(!brand){
    return next(new AppError(`there is no Brand with this id ${id}`,404))
  }
  res.status(200).json({
    result:brand
  })
});


// @DESC create Brand
// @route POSt /api/v1/brands
// @access private
exports.createBrand= catchAsync(async(req,res,next)=>{
  const {name} = req.body;
  const slug = slugify(name);
  const brand = await Brand.create({
    name,
    slug,
  });
  res.status(201).json({
    status:'success',
    data:brand
  });
});

// @DESC update specific Brand
// @route PATCH /api/v1/brands/:id
// @access private
exports.updateBrand = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const {name} = req.body;
  const brand = await Brand.findByPk(id);
  if(!brand){
    return next(new AppError(`there is no Brand with this id ${id}`,404));
  }
  const slug =slugify(name);
  const updatedBrand = await brand.update({
    name,
    slug,
  });
  res.status(201).json({
    result:updatedBrand
  })
});


// @DESC delete specific Brand
// @route DELETE /api/v1/brands/:id
// @access private
exports.deleteBrand= catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const brand = await Brand.destroy({where:{id}});
  if(!brand){
    return next(new AppError(`there is no Brand with this id ${id}`,404))
  }
    res.status(204).send();
});