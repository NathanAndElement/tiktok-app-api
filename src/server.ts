import 'dotenv/config';
import './db';
import Routes from './routes';
import express, { Express, NextFunction, Request, Response } from 'express';
import { IErrorClass } from './utils/ErrorClass';
import './passport';
import 'dotenv/config';
import './db';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/db/User';
import sendgrid from '@sendgrid/mail';
import AuthClass from './classes/AuthClass';
var MagicLinkStrategy = require('passport-magic-link').Strategy;
const { auth } = require('express-openid-connect');
const session = require('express-session');
const app: Express = express();
var MagicLinkStrategy = require('passport-magic-link').Strategy;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRET }));
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		User.authenticate()
	)
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

passport.use(
	new MagicLinkStrategy(
		{
			secret: 'my-secret',
			userFields: ['username', 'email', 'password'],
			tokenField: 'token',
			verifyUserAfterToken: true,
		},
		function send(user, token) {
			var link = 'http://localhost:3001/auth/login/email/verify?token=' + token;
			var msg = {
				to: user.email,
				from: 'nathan@and-element.com',
				subject: 'Sign in to Todos',
				text: 'Hello! Click the link below to finish signing in to Todos.\r\n\r\n' + link,
				html:
					'<h3>Hello!</h3><p>Click the link below to finish signing in to Todos.</p><p><a href="' +
					link +
					'">Sign in</a></p>',
			};
			return sendgrid.send(msg);
		},
		async function verify(user) {
			const existingUser = await User.findOne({ email: user.email });
			if (!existingUser) {
				const newUser = await AuthClass.Register(user);

				return newUser;
			} else {
				return existingUser;
			}
		}
	)
);

app.use((req: Request, res: Response, next: NextFunction) => {
	res.locals.currentUser = req.user;
	next();
});

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});

app.use('/', Routes);

app.use((err: IErrorClass, req: Request, res: Response, next: NextFunction) => {
	console.log(err, 'Caught by error handler');

	res.status(err.statusCode).send(err);
});
