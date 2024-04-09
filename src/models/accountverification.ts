import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { BaseCustomError } from "../utils/baseCustome";
import { StatusCode } from "../utils/statuscode";
import { string } from "zod";

const tokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    validate: (value: string): boolean => {
      if (!value || value.length !== 64) {
        throw new BaseCustomError(
          "Invalid email verification token",
          StatusCode.BadRequest
        );
      }
      return true;
    },
  },
  expiresAt: {
    type: Date,
    default: Date.now,
  },
});

export const Token = mongoose.model("Token", tokenSchema);
