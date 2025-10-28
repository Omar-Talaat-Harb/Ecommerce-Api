const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const {globalErrorHandler} = require('./middlewares/errorMiddleware');
//routes 
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');

//express app
const app = express();

//middlewares
app.use(express.json());
app.use(express.static(('uploads')))

if(process.env.NODE_ENV ==='development'){
  app.use(morgan('dev'))
}

//routes
app.use('/api/v1/categories',categoryRoutes);
app.use('/api/v1/subcategories',subCategoryRoutes);
app.use('/api/v1/brands',brandRoutes);
app.use('/api/v1/products',productRoutes);

app.all("/{*splat}",(req,res,next)=>{
  next(new AppError(`can't find this route: ${req.originalUrl}`,404))
})

//global error handling middleware
app.use(globalErrorHandler);


module.exports = app