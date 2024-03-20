import { NextFunction } from "express";
import { BaseCustomError } from "../utils/baseCustome";
import { ZodSchema, z } from "zod";
import { Request, Response } from "express";
import { StatusCode } from "../utils/statuscode";

const usevalidation = (Schema: ZodSchema) => {
  return (req: Request, res: Response, _next: NextFunction) => {
    try {
      Schema.parse(req.body);
      _next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.reduce(
          (acc: { [key: string | number]: string }, issue) => {
            acc[issue.path[0]] = issue.message;
            return acc;
          },
          {}
        );
        return res.status(StatusCode.BadRequest).json({ error: formattedErrors });
      } else {
        console.error("Unexpected error:", error);
        res.status(StatusCode.InternalServerError).json({ error: "Internal Server Error" });
      }
    }
  };
};
export { usevalidation };
