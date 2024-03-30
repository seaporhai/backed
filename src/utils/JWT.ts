import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseCustomError } from "./baseCustome";
import { StatusCode } from "./statuscode";

export const hashedPassword = async (password: string , salt : any) => {
    try {
      return await bcrypt.hash(password, salt);
    } catch (error: unknown) {
      throw new BaseCustomError("Unable to generate password!",StatusCode.InternalServerError);
    }
  };