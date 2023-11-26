import mongoose, { Document, Model, PassportLocalModel } from 'mongoose';
import joigoose from 'joigoose';
import passportLocalMongoose from 'passport-local-mongoose';
import Joi from 'joi';

const Joigoose = joigoose(mongoose);

export interface IUser extends Document {
	email: string;
	username: string;
}
interface IUserDocument extends IUser, Document {} //this is for the statics
interface IUserStatics extends PassportLocalModel<IUserDocument> {
	findAndValidate(name: string, password: string): Promise<IUser>;
}

const joiUserSchema = Joi.object({
	email: Joi.string().required(),
	username: Joi.string().required(),
});

const joiSchema: any = Joigoose.convert(joiUserSchema);
const mongooseUserSchema = new mongoose.Schema(joiSchema);

mongooseUserSchema.plugin(passportLocalMongoose);

const model = mongoose.model<IUserDocument, IUserStatics>('User', mongooseUserSchema);

export default model;
