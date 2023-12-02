import { ErrorClass } from '../utils/ErrorClass';

export function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.session.returnTo = req.originalUrl;
		next(new ErrorClass('You must be logged in to access this route', 401));
	}
}

export function returnTo(req, res, next) {
	if ((req.session as any).returnTo) {
		res.locals.returnTo = (req.session as any).returnTo;
	}
	next();
}
