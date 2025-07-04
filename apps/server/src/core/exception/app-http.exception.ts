import { HttpStatus } from "@nestjs/common";
import { AppException } from "./app.exception";

export abstract class AppHttpException extends AppException {
	public abstract code: HttpStatus;

	constructor(description: string, message: string) {
		super(message, description);
	}
}
