import { NextFunction, Request, Response } from "express";
import errorHandler from "../errorHandler";
import { StatusCode } from "../../utils/statuscode";
import { BaseCustomError } from "../../utils/baseCustome";

describe("errorHandler middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    };
    next = jest.fn();
  });

  it("handles BaseCustomError correctly", () => {
    const mockError = new BaseCustomError("Test error", StatusCode.BadRequest);

    errorHandler(mockError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCode.BadRequest);
    // expect(res.json).toHaveBeenCalledWith(mockError.serializeErrorOutput());
  });
});
