import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { BaseCustomError } from "../utils/baseCustome";
import { StatusCode } from "../utils/statuscode";

  const tokenSchema = new mongoose.Schema({
    useId: {
      type: mongoose.Schema.Types.ObjectId,
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
    required: false,
  },
});

export const Token = mongoose.model("Token", tokenSchema);
