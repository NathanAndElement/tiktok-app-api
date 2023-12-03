import express from 'express';
import passport from 'passport';
import { ErrorClass } from '../utils/ErrorClass';
import { isAuthenticated, returnTo } from '../middleware/auth';
import User from '../models/db/User';
import { catchAsync } from '../utils/catchAsync';
import AuthClass from '../classes/AuthClass';
var MagicLinkStrategy = require('passport-magic-link').Strategy;
const router = express.Router({ mergeParams: true });

router.post(
	'/phone-link/start',
	isAuthenticated,
	catchAsync(async (req, res, next) => {
		await AuthClass.LinkPhoneStart(req.body.countryCode, req.body.number);

		res.send({ message: 'phone link started' });
	})
);

router.post(
	'/phone-link/end',
	isAuthenticated,
	catchAsync(async (req, res, next) => {
		await AuthClass.PhoneLinkEnd(
			req.body.code,
			req.body.countryCode,
			req.body.number,
			res.locals.currentUser
		);

		res.send({ message: 'phone linked' });
	})
);

router.post(
	'/phone-unlink/start',
	isAuthenticated,
	catchAsync(async (req, res, next) => {
		await AuthClass.UnlinkPhoneStart(res.locals.currentUser);

		res.send({ message: 'phone unlink started' });
	})
);

router.post(
	'/phone-unlink/end',
	isAuthenticated,
	catchAsync(async (req, res, next) => {
		await AuthClass.PhoneUnlinkEnd(req.body.code, res.locals.currentUser);

		res.send({ message: 'phone unlinked' });
	})
);

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

router.post(
	'/reset-password',
	catchAsync(async (req, res, next) => {
		await AuthClass.ResetPassword(req.body.email);
		res.send({ success: true, message: 'password reset email sent' });
	})
);

router.get(
	'/reset-password/verify',
	catchAsync(async (req, res, next) => {
		res.send({
			success: true,
			message: 'Send new password to /auth/reset-password/verify/confirm',
		});
	})
);

router.post(
	'/reset-password/verify/confirm',
	catchAsync(async (req, res, next) => {
		const verified = await AuthClass.VerifyResetPassword(req.body.token);

		if (verified) {
			const resetPassword = await AuthClass.ResetPasswordConfirm(
				req.body.email,
				req.body.newPassword
			);
			res.send({ resetPassword, message: 'password reset' });
		}
		res.send({ verified, message: 'password not reset' });
	})
);

router.post('/login', (req, res, next) => {
	passport.authenticate('local', function (err, user, info) {
		if (!user) {
			return next(new ErrorClass('Invalid username or password', 400));
		}
		req.login(user, (loginErr) => {
			if (loginErr) {
				return next(new ErrorClass(loginErr.message, 400));
			}
			const redirectUrl = res?.locals?.returnTo ?? '/';

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
