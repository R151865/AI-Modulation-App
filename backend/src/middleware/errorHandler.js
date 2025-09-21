const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message)
  console.error('Stack:', err.stack)

  // Default error
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors).map(val => val.message).join(', ')
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400
    message = 'Duplicate field value entered'
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Resource not found'
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export default errorHandler