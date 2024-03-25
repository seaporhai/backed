import { Request, Response, NextFunction } from "express";
import { usevalidation } from "../usevalidation"; // Assuming usevalidation is correctly imported
import connectToDatabase from "../../utils/connecToDb"; // Assuming this is correctly imported
import { ZodSchema, object, string, number } from "zod";

connectToDatabase(); // Assuming this function call is needed

describe("validateInput middleware", () => {
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
  });

  describe("validate Input", () => {
    test("Valid Input", () => {
      const req: Request = {
        body: { name: "Mee Reak", age: 20 },
      } as Request;
      const schema: ZodSchema = object({
        name: string(),
        age: number(),
      });
      const middleware = usevalidation(schema); // Create the middleware function
      middleware(req, {} as Response, next); // Call the middleware function with a mock response
      expect(next).toHaveBeenCalled(); // Ensure next() was called
      expect(next).toHaveBeenCalledTimes(1); // Ensure next() was called only once
    });
  });
});
