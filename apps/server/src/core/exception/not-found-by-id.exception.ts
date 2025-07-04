import { Type } from "@nestjs/common";
import { AppNotFoundException } from "./app-not-found.exception";

export class NotFoundByIdException extends AppNotFoundException {
	constructor(model: Type, id: number | string, description: string) {
		super(description, `${model.name} not found by id: '${id}'`);
	}
}
