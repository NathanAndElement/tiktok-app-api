import { ILinkPhone } from './../models/request/user';
import sendgrid from '@sendgrid/mail';
import { ICreateUser, ILoginUser, createUserSchema, linkPhoneSchema } from '../models/request/user';
import User, { IUser } from '../models/db/User';
import { ErrorClass } from '../utils/ErrorClass';
import jwt from 'jsonwebtoken';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);
import bcrypt from 'bcrypt';

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

	static async LinkPhoneStart(countryCode: string, number: string) {
		if (!countryCode || !number) {
			throw new ErrorClass('Country code and number are required', 400);
		}

		const fullNumber = countryCode + number;

		client.verify.v2.services
			.create({ friendlyName: 'Verify phone number' })
			.then((service) => console.log(service.sid));
		client.verify.v2
			.services('VA5aa1f8f5f756a4e636909e8d6f02c444')
			.verifications.create({ to: `+${fullNumber}`, channel: 'sms', from: '+447700139730' })
			.then((verification) => console.log(verification.status));
		return;
	}

	static async PhoneLinkEnd(code: string, countryCode: string, number: string, user: IUser) {
		if (!code) {
			throw new ErrorClass('Code is required', 400);
		}
		if (!countryCode || !number) {
			throw new ErrorClass('Country code and number are required', 400);
		}

		const currentUser = await User.findOne({ _id: user._id });
		if (!currentUser) {
			throw new ErrorClass('User not found', 404);
		}

		const fullNumber = countryCode + number;

		const verificationCheck = await client.verify.v2
			.services('VA5aa1f8f5f756a4e636909e8d6f02c444')
			.verificationChecks.create({ to: `+${fullNumber}`, code: code });

		if (verificationCheck.status !== 'approved') {
			throw new ErrorClass('Code is invalid', 400);
		}

		currentUser.phone = {
			countryCode,
			number,
		};
		currentUser.security.phone.linkedTimestamp = new Date();
		currentUser.security.phone.removedTimestamp = undefined;
		await currentUser.save();

		return;
	}

	static async UnlinkPhoneStart(user: IUser) {
		const currentUser = await User.findOne({ _id: user._id });
		if (!currentUser) {
			throw new ErrorClass('User not found', 404);
		}

		const fullNumber = currentUser.phone?.countryCode + currentUser.phone?.number;

		client.verify.v2.services
			.create({ friendlyName: 'Unlink phone number' })
			.then((service) => console.log(service.sid));
		client.verify.v2
			.services('VA5aa1f8f5f756a4e636909e8d6f02c444')
			.verifications.create({ to: `+${fullNumber}`, channel: 'sms', from: '+447700139730' })
			.then((verification) => console.log(verification.status));
		return;
	}

	static async PhoneUnlinkEnd(code: string, user: IUser) {
		if (!code) {
			throw new ErrorClass('Code is required', 400);
		}

		const currentUser = await User.findOne({ _id: user._id });
		if (!currentUser) {
			throw new ErrorClass('User not found', 404);
		}

		const fullNumber = currentUser.phone?.countryCode + currentUser.phone?.number;

		const verificationCheck = await client.verify.v2
			.services('VA5aa1f8f5f756a4e636909e8d6f02c444')
			.verificationChecks.create({ to: `+${fullNumber}`, code: code });

		if (verificationCheck.status !== 'approved') {
			throw new ErrorClass('Code is invalid', 400);
		}

		currentUser.phone = undefined;
		currentUser.security.phone.linkedTimestamp = undefined;
		currentUser.security.phone.removedTimestamp = new Date();
		await currentUser.save();

		return;
	}
}
