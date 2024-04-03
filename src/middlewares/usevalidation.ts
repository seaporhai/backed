import { NextFunction } from "express";
import { BaseCustomError } from "../utils/baseCustome";
import { ZodSchema, string, z } from "zod";
import { Request, Response } from "express";
import { StatusCode } from "../utils/statuscode";

const usevalidation = (Schema: ZodSchema) => {
  return (req: Request, res: Response, _next: NextFunction) => {
    try {
      Schema.parse(req.body);
      _next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        _next(new BaseCustomError('username or password is invalid',StatusCode.BadRequest))
      } else {
        _next(new BaseCustomError('unable to validate user',StatusCode.InternalServerError))
      }
    }
  };
};
export { usevalidation };
