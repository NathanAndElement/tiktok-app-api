/**
 * Example model for Mongo/Joigoose
 */

import mongoose from 'mongoose';
import joigoose from 'joigoose';
import Joi from 'joi';

const Joigoose = joigoose(mongoose);

export interface IUser extends mongoose.Document {
	name: string;
	password: string;
}

const joiUserSchema = Joi.object({
	name: Joi.string().required(),
	password: Joi.string().required(),
});

const joiSchema: any = Joigoose.convert(joiUserSchema);
const mongooseUserSchema = new mongoose.Schema(joiSchema);
const model = mongoose.model<IUser>('User', mongooseUserSchema);

export default model;
