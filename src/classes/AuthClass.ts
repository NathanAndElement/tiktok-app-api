import sendgrid from '@sendgrid/mail';
import { ICreateUser, ILoginUser, createUserSchema } from '../models/request/user';
import User from '../models/db/User';
import { ErrorClass } from '../utils/ErrorClass';
import jwt from 'jsonwebtoken';

export default class AuthClass {
	static async Register(details: ICreateUser) {
		try {
			await createUserSchema.validateAsync(details);
			const user = new User({
				email: details.email,
				username: details.username,
				email_verified: true,
			});
			const newUser = await User.register(user, details.password);
			return newUser;
		} catch (e) {
			throw new ErrorClass(e.message, 400);
		}
	}

	static async ResetPassword(email: string) {
		if (!email) {
			throw new ErrorClass('Email is required', 400);
		}
		const user = await User.findOne({ email });

		if (!user) {
			return;
		}

		const token = jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '5m' });

		const link =
			'http://localhost:3001/auth/reset-password/verify?token=' + token + '?email=' + email;
		const msg = {
			to: email,
			from: 'nathan@and-element.com',
			subject: 'Reset password request',
			text: 'Hello! To reset your password, click the link.\r\n\r\n' + link,
			html:
				'<h3>Hello!</h3><p>Click the link below to reset your password.</p><p><a href="' +
				link +
				'">Reset password</a></p>',
		};
		return sendgrid.send(msg);
	}

	static async VerifyResetPassword(token: string) {
		if (!token) {
			throw new ErrorClass('Token is required', 400);
		}
		try {
			const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

			return decoded;
		} catch (e) {
			throw new ErrorClass('Invalid or expired token', 400);
		}
	}

	static async ResetPasswordConfirm(email: string, newPassword: string) {
		User.findOne({ email }).then(
			function (sanitizedUser) {
				if (sanitizedUser) {
					(sanitizedUser as any).setPassword(newPassword, function () {
						sanitizedUser.save();
						return sanitizedUser;
					});
				} else {
					throw new ErrorClass('User not found', 404);
				}
			},
			function (err) {
				throw new ErrorClass('Something went wrong changing passwords', 500);
			}
		);
	}
}
