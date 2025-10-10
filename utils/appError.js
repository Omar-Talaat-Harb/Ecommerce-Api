// @DESC this class is responsible about operational errors (errors that i can predict)
class AppError extends Error{
  constructor(message,statusCode){
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
  }
}

module.exports = AppError;