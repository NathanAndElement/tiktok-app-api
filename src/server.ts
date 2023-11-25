import 'dotenv/config';
import './db';
import Routes from './routes';
const { auth } = require('express-openid-connect');
import express, { Express, NextFunction, Request, Response } from 'express';
import { IErrorClass } from './utils/ErrorClass';
import { IUser } from './models/db/User';

const session = require('express-session');
const app: Express = express();

app.use(session({ secret: process.env.SECRET }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});

app.use('/', Routes);

app.use((err: IErrorClass, req: Request, res: Response, next: NextFunction) => {
	console.log(err, 'Caught by error handler');
	res.status(err.statusCode).send(err);
});
