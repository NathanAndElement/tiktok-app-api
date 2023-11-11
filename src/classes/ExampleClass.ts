import Example, { IExample } from './../models/db/Example';

export default class ExampleClass {
	static async GetExamples() {
		return await Example.find();
	}
}
