import { Request, Response, NextFunction } from 'express';

// Define a type for async route handlers
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync = (fn: AsyncRouteHandler) => {
	return (req: Request, res: Response, next: NextFunction) => {
		fn(req, res, next).catch(next);
	};
};
