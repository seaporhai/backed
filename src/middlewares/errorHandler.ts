import { Request, Response, NextFunction } from "express";
import { BaseCustomError } from "../utils/baseCustome";

// Global error handler middleware
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Default to 500 if no status code is set
  if (err instanceof BaseCustomError) {
    const statusCode = err.statusCode;

    //res to client
    return res.status(statusCode).json({
      statusCode: statusCode,
      message: err.message,
    });
  }
  _next();
}

export default errorHandler;
