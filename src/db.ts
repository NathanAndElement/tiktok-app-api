import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

if (process.env.DEBUG === 'true') console.log(`Mongoose debugging is turned on`);

if (!process.env.MONGO_URL) {
	console.warn('No mongo URL specified, no Mongo connection will run');
} else {
	mongoose
		.connect(process.env.MONGO_URL, {
			ignoreUndefined: true,
		})
		.then(() => {
			console.log('MongoDB connected...');
		})
		.catch((error: any) => {
			console.error(error.stack);
		});
}
