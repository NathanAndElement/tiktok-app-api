import mongoose, { Document, Model, PassportLocalModel } from 'mongoose';
import joigoose from 'joigoose';
import passportLocalMongoose from 'passport-local-mongoose';
import Joi from 'joi';

const Joigoose = joigoose(mongoose);

export interface IUser extends Document {
	email: string;
	username: string;
	email_verified: boolean;
	phone?: {
		countryCode: string;
		number: string;
	};
	security: {
		phone: {
			linkedTimestamp?: Date;
			removedTimestamp?: Date;
		};
	};
}
interface IUserDocument extends IUser, Document {} //this is for the statics
interface IUserStatics extends PassportLocalModel<IUserDocument> {
	findAndValidate(name: string, password: string): Promise<IUser>;
	plugin: any;
}

const joiUserSchema = Joi.object({
	email: Joi.string().required(),
	username: Joi.string().required(),
	email_verified: Joi.boolean().required(),
	phone: Joi.object({
		countryCode: Joi.string().optional(),
		number: Joi.string().optional(),
	}).optional(),
	security: Joi.object({
		phone: Joi.object({
			linkedTimestamp: Joi.date().optional(),
			removedTimestamp: Joi.date().optional(),
		}).optional(),
	}).optional(),
});

const joiSchema: any = Joigoose.convert(joiUserSchema);
const mongooseUserSchema = new mongoose.Schema(joiSchema);

mongooseUserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const model = mongoose.model<IUserDocument, IUserStatics>('User', mongooseUserSchema);

export default model;
