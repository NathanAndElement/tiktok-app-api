import Joi from 'joi';

export interface ICreateUser {
	name: string;
	password: string;
}
export interface ILoginUser {
	name: string;
	password: string;
}

export const createUserSchema = Joi.object<ICreateUser, true>({
	name: Joi.string().required(),
	password: Joi.string().required(),
});
