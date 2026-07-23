import { ParseError } from "elysia/error";
import { StatusCodes } from "http-status-codes";

export class HttpError extends ParseError {
  public override status: number;

  constructor({
    message,
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    payload,
  }: {
    message: string;
    status?: number;
    payload?: Record<string, unknown>;
  }) {
    super(new Error(message));
    this.status = status;
    this.message = message;
    this.cause = { status, message, payload };
  }
}
