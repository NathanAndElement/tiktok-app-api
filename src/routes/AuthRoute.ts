import express, { NextFunction, Request, Response } from 'express';
import ExampleClass from '../classes/ExampleClass';
import { catchAsync } from '../utils/catchAsync';
import AuthClass from '../classes/AuthClass';
import { SessionData } from 'express-session';
import { isAuthenticated } from '../middleware/auth';
const router = express.Router({ mergeParams: true });

router.post(
	'/register',
	catchAsync(async (req: Request, res, next) => {
		const user = await AuthClass.Register(req.body);
		if (user) {
			(req as any).session.user_id = user._id;
		}
		res.send(user);
	})
);

router.post(
	'/login',
	catchAsync(async (req, res, next) => {
		const { user, verified } = await AuthClass.Login(req.body);
		if (verified) {
			(req as any).session.user_id = user._id;
		}
		res.send({ loggedIn: verified });
	})
);

router.get('/logout', (req, res) => {
	req.session.destroy((err: Error) => {
		if (err) {
			res.status(500).send('Could not log out');
		} else {
			res.send('Logged out');
		}
	});
});

router.get(
	'/secret',
	isAuthenticated,
	catchAsync(async (req, res, next) => {
		res.send({ message: 'Secret page' });
	})
);

module.exports = router;
