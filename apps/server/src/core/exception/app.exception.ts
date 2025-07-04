export class AppException extends Error {
	public readonly description?: string;

	constructor(message: string, description?: string) {
		super(message);
		this.description = description;
	}
}
