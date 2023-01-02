const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

/*app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});*/
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

/*app.get('/', (req, res) => {
  res.status(404).json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});*/

// 2) ROUTE HANDLERS

// 3) ROUTES
app
	.use('/api/v1/tours', tourRouter)
	.use('/api/v1/users', userRouter)
	// catch error
	.all('*', (req, res, next) => {
		next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
	})
	// global error middleware
	.use(globalErrorHandler);

// 4) START SERVER
module.exports = app;
