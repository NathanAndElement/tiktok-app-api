import { ICreateUser, ILoginUser, createUserSchema } from '../models/request/user';
import User from '../models/db/User';
import { ErrorClass } from '../utils/ErrorClass';
const bcrypt = require('bcrypt');

export default class AuthClass {
	static async Register(body: ICreateUser) {
		await createUserSchema.validateAsync(body);
		const hash = await bcrypt.hash(body.password, 12);

		const user = new User({
			name: body.name,
			password: hash,
		});
		await user.save();
		return user;
	}

	static async Login(details: ILoginUser) {
		const { name, password } = details;

		const user = await User.findOne({ name });
		if (!user) {
			throw new ErrorClass('Incorrect username or password', 404);
		}
		const verified = await bcrypt.compare(password, user.password);
		return { verified, user };
	}
}
