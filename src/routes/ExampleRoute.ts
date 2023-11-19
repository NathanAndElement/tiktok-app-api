import express, { NextFunction, Request, Response } from 'express';
import ExampleClass from '../classes/ExampleClass';
import { catchAsync } from '../utils/catchAsync';
import { ErrorClass } from '../utils/ErrorClass';

const router = express.Router({ mergeParams: true });

router.get(
	'/',
	catchAsync(async (req, res, next) => {
		res.send(await ExampleClass.GetExamples());
	})
);

module.exports = router;
