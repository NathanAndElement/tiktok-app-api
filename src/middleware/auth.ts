import { ErrorClass } from '../utils/ErrorClass';

export function isAuthenticated(req, res, next) {
	if ((req as any).isAuthenticated()) {
		return next();
	} else {
		next(new ErrorClass('You must be logged in to access this route', 401));
	}
}
