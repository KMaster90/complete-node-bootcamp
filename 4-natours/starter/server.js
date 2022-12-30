/** @type {import('@types/moongoose')} */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URL
                  .replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
                  .replace('<USER>', process.env.DATABASE_USER)
                  .replace('<DB_NAME>', process.env.DATABASE_DB_NAME);
console.log(DB, 'DB');
mongoose.connect(DB, {}).then(() => console.log('DB connection successful!'));

const app = require('./app');

console.log(process.env);
console.log(app.get('env'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
