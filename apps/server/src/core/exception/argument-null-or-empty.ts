import { AppException } from "./app.exception";

export class ArgumentNullOrEmptyException extends AppException {
	constructor(argName: string) {
		super(`Argument: '${argName}' null or empty`);
	}
}
