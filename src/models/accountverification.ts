import mongoose from "mongoose";

  const tokenSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
});

export const Token = mongoose.model("Token", tokenSchema);
