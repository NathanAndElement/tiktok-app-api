import 'dotenv/config';
import './db';
import express, { Express } from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/db/User';
import sendgrid from '@sendgrid/mail';
import AuthClass from './classes/AuthClass';
const { auth } = require('express-openid-connect');
const session = require('express-session');
const app: Express = express();
var MagicLinkStrategy = require('passport-magic-link').Strategy;

export const passportConfig = () => {
	sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
	app.use(session({ secret: process.env.SECRET }));
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
					text:
						'Hello! Click the link below to finish signing in to Todos.\r\n\r\n' + link,
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
};
