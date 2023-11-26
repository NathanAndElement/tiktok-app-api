import express, { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import AuthClass from '../classes/AuthClass';
import passport from 'passport';
import { ErrorClass } from '../utils/ErrorClass';
import { isAuthenticated } from '../middleware/auth';
const router = express.Router({ mergeParams: true });

router.post(
	'/register',
	catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const newUser = await AuthClass.Register(req.body);

		req.login(newUser, (loginErr) => {
			if (loginErr) {
				return next(new ErrorClass('Invalid username or password', 400));
			}
			return res.status(200).send(newUser);
		});
	})
);

router.post('/login', (req, res, next) => {
	passport.authenticate('local', function (err, user, info) {
		if (!user) {
			return next(new ErrorClass('Invalid username or password', 400));
		}
		req.login(user, (loginErr) => {
			if (loginErr) {
				return next(new ErrorClass('Invalid username or password', 400));
			}
			return res.send({ success: true, message: 'authentication succeeded' });
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
