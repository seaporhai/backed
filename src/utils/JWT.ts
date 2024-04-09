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

  export const generateTokenJWT = async (payload: object): Promise<string> => {
    try {
      // Ensure process.env.APP_SECRET and process.env.JWT_EXPIRES_IN are defined and have valid values
      if (!process.env.APP_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw new Error('Environment variables are not properly configured');
      }
  
      // Generate JWT token with payload
      const token = await jwt.sign(payload, process.env.APP_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
  
      return token;
    } catch (error) {
      console.error('Error generating JWT token:', error);
      throw new BaseCustomError(
        'Unable to generate JWT token',
        StatusCode.InternalServerError
      );
    }
  };
    export const verifyPassword = async (pass: string, hashPass: string) => {
      const isMatch = await bcrypt.compare(pass, hashPass);
      if (!isMatch) {
        throw new BaseCustomError("Invalid username or password", StatusCode.BadRequest);
      }
  };  