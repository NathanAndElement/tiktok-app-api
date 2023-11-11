import Joi from 'joi';

export interface ICreateExample {
	startTimestamp: Date;
	endTimestamp?: Date;
	sessionId: string;
}

export const createExampleSchema = Joi.object<ICreateExample, true>({
	startTimestamp: Joi.date(),
	endTimestamp: Joi.date(),
	sessionId: Joi.string(),
});
