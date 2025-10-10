const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const {globalErrorHandler} = require('./utils/globalError');
const categoryRoutes = require('./routes/categoryRoutes');

//express app
const app = express();

//middlewares
app.use(express.json()); 

if(process.env.NODE_ENV ==='development'){
  app.use(morgan('dev'))
}

//routes
app.use('/api/v1/categories',categoryRoutes);

app.all("/{*splat}",(req,res,next)=>{
  // res.status(404).json({message:'route not found'})
  // const err = new Error(`can't find this route: ${req.originalUrl}`);
  // next(err.message);
  next(new AppError(`can't find this route: ${req.originalUrl}`,404))
})

//global error handling middleware
app.use(globalErrorHandler);


module.exports = app