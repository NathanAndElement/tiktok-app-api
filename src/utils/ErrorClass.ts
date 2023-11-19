export interface IErrorClass {
	readableMessage: string;
	message: string;
	statusCode: number;
}

export class ErrorClass extends Error {
	constructor(public message: string, public readableMessage: string, public statusCode: number) {
		super(message);
		this.readableMessage = readableMessage;
		this.statusCode = statusCode;
	}
}
