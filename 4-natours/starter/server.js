/** @type {import('@types/moongoose')} */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	console.log(err.name, ' --- ', err.message);
	process.exit(1);
});

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE_URL
                  .replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
                  .replace('<USER>', process.env.DATABASE_USER)
                  .replace('<DB_NAME>', process.env.DATABASE_DB_NAME);
console.log(DB, 'DB');
mongoose.connect(DB, {})
        .then(() => console.log('DB connection successful!'));

// .catch(err => console.error('DB connection failed! \n -------> \n', err));

const app = require('./app');
// console.log(process.env);

// console.log(app.get('env'));
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
// mongoose.connection.on('error', err => {
// 	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
// 	console.log(err.name, ' --- ', err.message);
// 	server.close(() => {
// 		process.exit(1);
// 	});

// });


process.on('unhandledRejection', err => {
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
// console.log(x);
