import { userModel } from "../models/users.model";
import { Request, Response } from "express";
import { BaseCustomError } from "../utils/baseCustome";
import { StatusCode } from "../utils/statuscode";
import errorHandler from "../middlewares/errorHandler";
export class userRepo {
  // static adduser(student: { username: string; age: number; }) {
  //   throw new Error("Method not implemented.");
  // }
  // static createUser(arg0: { name: string; age: number; }) {
  //   throw new Error("Method not implemented.");
  // }
  // static showStudentById(id: any) {
  //     throw new Error("Method not implemented.");
  // }
  //search all
  async searchUser(req: Request): Promise<any> {
    try {
      // Extract query parameters from the request
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Fetch users with pagination
      const userData = await userModel.find({}).skip(skip).limit(limit);

      if (!userData) {
        throw new BaseCustomError("No data Found", StatusCode.NotFound);
      }

      return userData;
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
      // Handle other errors here if needed
      throw new Error("An error occurred while searching for users.");
    }
  }
  //by Id
  async SearchId(id: string) {
    return await userModel.findById(id);
  }
  async getUserByEmail({ email }: { email: string }) {
    try {
      const existingUser = await userModel.findOne({ email: email });
      return existingUser;
    } catch (error: unknown) {
      throw null;
    }
  }
  //create
  async createUser(user: any): Promise<any> {
    try {
      const { username, age, email, password } = user;
      
      // Check if user with the same email already exists
      const existingUser = await userModel.findOne({ email });
  
      if (existingUser) {
        throw new BaseCustomError("Email already in use!", StatusCode.Conflict);
      }
  
      // Create the new user
      const userCreated = await userModel.create(user);
      return userCreated;
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      } else if (error instanceof Error) {
        // Handle other types of errors
        console.error("Error:", error.message);
        throw new BaseCustomError(
          "Unable to create user in database!",
          StatusCode.InternalServerError
        );
      } else {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
        throw new BaseCustomError(
          "Unexpected error occurred!",
          StatusCode.InternalServerError
        );
      }
    }
  }

  //update
  async updateUser(id: string, user: object) {
    return await userModel.findByIdAndUpdate(id, user, { new: true });
  }
  //delete user
  async DeleteUser(id: string) {
    return await userModel.findOneAndDelete({ _id: id });
  }
}
