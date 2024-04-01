import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseCustomError } from "./baseCustome";
import { StatusCode } from "./statuscode";
import { randomBytes } from "crypto";

const salt = 10;

export const hashedPassword = async (password: string, salt: any) => {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error: unknown) {
    throw new BaseCustomError(
      "Unable to generate password!",
      StatusCode.InternalServerError
    );
    3;
  }
};

export function generateToken() {
  const generateDate = (expiresIn = 20000) => {
    const token = randomBytes(20).toString("hex");
    const expiresAt = Date.now() + expiresIn;
    return { token, expiresAt };
  };
  const { token, expiresAt } = generateDate(20000);
  console.log("Generated token:", token);
  console.log("Token expires at:", new Date(expiresAt));
  return token;
}
