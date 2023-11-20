import { RequestOIDC } from '../types/express';
import express, { NextFunction, Response } from 'express';
import ExampleClass from '../classes/ExampleClass';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router({ mergeParams: true });
const { requiresAuth } = require('express-openid-connect');

router.get(
	'/',
	catchAsync(async (req, res, next) => {
		res.send(await ExampleClass.GetExamples());
	})
);

router.get('/auth', (req: RequestOIDC, res: Response, next: NextFunction) => {
	console.log(req.oidc.isAuthenticated());

	res.send({ authenticated: req.oidc.isAuthenticated(), user: req.oidc.user });
});

router.get('/secret', requiresAuth(), (req: RequestOIDC, res: Response, next: NextFunction) => {
	console.log(req.oidc.isAuthenticated());

	res.send({
		secret: 'Secret page',
		authenticated: req.oidc.isAuthenticated(),
		user: req.oidc.user,
	});
});
module.exports = router;
