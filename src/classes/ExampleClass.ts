import { NextFunction } from 'express';
import Example, { IExample } from './../models/db/Example';
import { ErrorClass } from '../utils/ErrorClass';

export default class ExampleClass {
	static async GetExamples() {
		const examples = await Example.find();

		if (!examples.length) {
			throw new ErrorClass('No examples found', 404); // 404 Not Found
		}

		return examples;
	}
}
