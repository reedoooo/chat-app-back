const CustomError = require('./customError');

const errorHandler = (err, req, res, next) => {
  let customError = { ...err };

  customError.message = err.message;

  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    customError = new CustomError(404, message);
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    customError = new CustomError(400, message);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    customError = new CustomError(400, message);
  }

  res.status(customError.statusCode || 500).json({
    success: false,
    error: customError.message || 'Server Error'
  });
};

module.exports = errorHandler;
