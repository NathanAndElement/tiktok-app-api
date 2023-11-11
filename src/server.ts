import 'dotenv/config';
import './db';
import Routes from './routes';

import express, { Express, Request, Response } from 'express';
const app: Express = express();

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});

app.use('/', Routes);
