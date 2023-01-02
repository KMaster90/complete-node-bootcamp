const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
};
const sendErrorProd = (err, res) => {
	// Operational, trusted error: send message to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	}
	// Programming or other unknown error: don't leak error details
	else {
		// 1) Log error
		console.error('ERROR 💥', err);
		// 2) Send generic message
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!'
		});
	}
};

const handleCastErrorDB = (error) => {
	const message = `Invalid ${error.path}: '${error.value}'.`;
	return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (error) => {
	const value = Object.keys(error.errors)[0];
	const message = `Duplicate field value: '${value}'. Please use another value!`;
	return new AppError(message, 400);
};
const handleValidationErrorDB = (error) => {
	const errors = Object.values(error.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;
	return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
	console.log(err.stack);
	
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	
	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err };
		if (error.reason?.name === 'BSONTypeError') error = handleCastErrorDB(error);
		if (error._message === 'Tour validation failed') error = handleDuplicateFieldsDB(error);
		if (error._message === 'Validation failed') error = handleValidationErrorDB(error);
		
		sendErrorProd(error, res);
	}
	
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message
	});
};
