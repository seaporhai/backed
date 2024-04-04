import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseCustomError } from "./baseCustome";
import { StatusCode } from "./statuscode";
import { randomBytes } from "crypto";



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
    const token = randomBytes(32).toString("hex");
    return token;
  };
