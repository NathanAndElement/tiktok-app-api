export interface IErrorClass {
	readableMessage: string;
	message: string;
	statusCode: number;
}

export class ErrorClass extends Error {
	constructor(public readableMessage: string, public statusCode: number) {
		super(readableMessage);
		this.statusCode = statusCode;
	}
}
