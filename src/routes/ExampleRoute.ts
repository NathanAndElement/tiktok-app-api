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

module.exports = router;
