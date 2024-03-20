import { Request, Response, NextFunction } from "express";
import { BaseCustomError } from "../utils/baseCustome";
import { StatusCode } from "../utils/statuscode";

// Global error handler middleware
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Default to 500 if no status code is set
  if (err instanceof BaseCustomError) {
    const statusCode = err.statuscode;

    //res to client
    return res.status(statusCode).json({
      statusCode: statusCode,
      message: err.message,
    });
  }
}

export default errorHandler;
