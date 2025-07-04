import { HttpStatus } from "@nestjs/common";
import { AppHttpException } from "./app-http.exception";

export class AppNotFoundException extends AppHttpException {
	public readonly code: HttpStatus = HttpStatus.NOT_FOUND;

	constructor(description: string, message: string = "Data not found") {
		super(description, message);
	}
}
