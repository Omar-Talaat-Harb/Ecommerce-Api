const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const {globalErrorHandler} = require('./middlewares/errorMiddleware');
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
  next(new AppError(`can't find this route: ${req.originalUrl}`,404))
})

//global error handling middleware
app.use(globalErrorHandler);


module.exports = app