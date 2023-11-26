import { ICreateUser, ILoginUser, createUserSchema } from '../models/request/user';
import User from '../models/db/User';
import { ErrorClass } from '../utils/ErrorClass';

export default class AuthClass {
	static async Register(details: ICreateUser) {
		try {
			await createUserSchema.validateAsync(details);
			const user = new User({ email: details.email, username: details.username });
			const newUser = await User.register(user, details.password);
			return newUser;
		} catch (e) {
			throw new ErrorClass(e.message, 400);
		}
	}
}
