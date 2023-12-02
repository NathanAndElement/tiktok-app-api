import express from 'express';
import passport from 'passport';
import { ErrorClass } from '../utils/ErrorClass';
import { isAuthenticated, returnTo } from '../middleware/auth';
import User from '../models/db/User';
import { catchAsync } from '~/utils/catchAsync';
var MagicLinkStrategy = require('passport-magic-link').Strategy;
const router = express.Router({ mergeParams: true });

router.post(
	'/register',
	(passport as any).authenticate('magiclink', { action: 'requestToken' }),
	catchAsync(async (req, res, next) => {
		try {
			const { email } = req.body;
			const existingUser = await User.findOne({ email });

			if (existingUser) {
				throw new ErrorClass('User already exists', 400);
			}

			res.send({ success: true, message: 'magic link sent' });
		} catch (error) {
			throw new ErrorClass(error, 500);
		}
	})
);

router.get(
	'/login/email/verify',
	passport.authenticate('magiclink', {
		successReturnToOrRedirect: '/',
		failureRedirect: '/login',
	})
);

router.post('/login', returnTo, (req, res, next) => {
	passport.authenticate('local', function (err, user, info) {
		if (!user) {
			return next(new ErrorClass('Invalid username or password', 400));
		}
		req.login(user, (loginErr) => {
			if (loginErr) {
				return next(new ErrorClass(loginErr, 400));
			}
			const redirectUrl = res.locals.returnTo || '/';

			return res.redirect(redirectUrl);
		});
	})(req, res, next);
});

router.get('/logout', (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(new ErrorClass('Error logging out', 500));
		}
		res.send({ success: true, message: 'logout succeeded' });
	});
});

router.get('/secret', isAuthenticated, (req, res, next) => {
	res.send({ message: 'secret', user: res.locals.currentUser });
});

module.exports = router;
