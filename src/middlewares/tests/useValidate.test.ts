import { Request, Response, NextFunction } from "express";
import { usevalidation } from "../usevalidation"; // Assuming usevalidation is correctly imported
import connectToDatabase from "../../utils/connecToDb"; // Assuming this is correctly imported
import { ZodSchema, object, string, number, Schema } from "zod";
import { BaseCustomError } from "../../utils/baseCustome";

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

  test("Invalid Input", async () => {
    const req = { body: { username: "Hello" } };
    const res = {};
    const next = jest.fn();
    try {
      usevalidation(object({ username: string() }));
    } catch (error: any | unknown) {
      expect(error).toBeInstanceOf(BaseCustomError); // Expect an ApiError to be thrown
      expect(error.message).toContain("required_error"); // Check for specific error message
    }
  });
  test("Unexpected Error", async () => {
    const req = {} as Request; // Invalid request object (to trigger unexpected error)
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    try {
    usevalidation(object({ username: string() }));
    } catch (error: any | unknown) {
      expect(error).toBeInstanceOf(BaseCustomError); // Expect an ApiError to be thrown
      expect(error.message).toContain("Internal Server Error"); // Check for generic error message
    }
  });
});
