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
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    description: string,
    isOperational: boolean
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

class APIError extends BaseError {
  constructor(
    name: string,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = "internal server error"
  ) {
    super(name, httpCode, description, isOperational);
  }
}

class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    return undefined;
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}

// const errorHandlingMiddleware = (req:Request,res:Response,next:NextFunction) => {

// }

export { BaseError, APIError };
