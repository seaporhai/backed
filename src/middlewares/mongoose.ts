import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

const validateMongooseId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  next();
};

export { validateMongooseId };
