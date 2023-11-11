/**
 * Example model for Mongo/Joigoose
 */

import mongoose from 'mongoose';
import joigoose from 'joigoose';
import Joi from 'joi';

const Joigoose = joigoose(mongoose);

export interface IExample extends mongoose.Document {
	startTimestamp: Date;
	endTimestamp?: Date;
	sessionId: string;
}

const joiExampleSchema = Joi.object({
	startTimestamp: Joi.date(),
	endTimestamp: Joi.date(),
	sessionId: Joi.string(),
});

const joiSchema: any = Joigoose.convert(joiExampleSchema);
const mongooseExampleSchema = new mongoose.Schema(joiSchema);
const model = mongoose.model<IExample>('Example', mongooseExampleSchema);

export default model;
