import { NextFunction, Request, Response } from "express";

enum HttpStatusCode {
  "SUCCESS" = 200,
  "RESOURCE_CREATED" = 201,
  "UNAUTHORIZED" = 401,
  "NOT_FOUND" = 404,
  "FORBIDDEN" = 403,
  "INTERNAL_SERVER" = 500,
}

class BaseError extends Error {
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    httpCode: HttpStatusCode,
    message: string,
    isOperational: boolean
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

class ApiError extends BaseError {
  constructor(code: HttpStatusCode, message: string, isOperational = true) {
    super(code, message, isOperational);
  }

  static badRequest(msg: string) {
    return new ApiError(400, msg);
  }

  static internal(msg: string) {
    return new ApiError(500, msg);
  }
}

class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    return undefined;
  }

  public isTrustedError(error: Error) {
    return error instanceof BaseError && error.isOperational;
  }
}

type ApiErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const apiErrorHandler: ApiErrorHandler = (err, req, res) => {
  console.error(err);

  if (err instanceof BaseError) {
    res.status(err.httpCode).json(err.message);
    return;
  }

  res.status(500).json("something went wrong");
};

export { BaseError, ApiError, ErrorHandler, apiErrorHandler };
