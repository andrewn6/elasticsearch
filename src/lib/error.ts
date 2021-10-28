import { Response } from "express";

class ErrorHandler extends Error  {
	public statusCode: number;
	public message: string;

	constructor(statusCode: number, message: string) {
		super();
		this.statusCode = statusCode;
		this.message = message;
	}
}

const handleError = (error: ErrorHandler, response: Response) => {
	const { statusCode, message } = error;
	response.status(statusCode).json({
		status: "error",
		statusCode,
		message
	});
};

export { ErrorHandler, handleError };