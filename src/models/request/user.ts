import Joi from 'joi';

export interface ICreateUser {
	email: string;
	username: string;
	password: string;
}
export interface ILoginUser {
	email: string;
	password: string;
}

export interface ILinkPhone {
	countryCode: string;
	number: string;
}

export const createUserSchema = Joi.object<ICreateUser, true>({
	email: Joi.string().required(),
	username: Joi.string().required(),
	password: Joi.string().required(),
});

export const linkPhoneSchema = Joi.object<ILinkPhone, true>({
	countryCode: Joi.string().required(),
	number: Joi.string().required(),
});
