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

  export const generateTokenJWT = async (payload: object) => {
    try {
      return await jwt.sign(payload, process.env.APP_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
    } catch (error) {
      throw new BaseCustomError(
        "Unable to generate signature from jwt",
        StatusCode.BadRequest
      );
    }
  };
    export const verifyPassword = async (pass: string, hashPass: string) => {
      const isMatch = await bcrypt.compare(pass, hashPass);
      if (!isMatch) {
        throw new BaseCustomError("Invalid username or password", StatusCode.BadRequest);
      }
  };  