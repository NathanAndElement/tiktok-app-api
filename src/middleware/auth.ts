export function isAuthenticated(req, res, next) {
	if ((req as any).session.user_id) {
		return next();
	}
	res.redirect('/login');
}
