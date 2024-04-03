import { userModel } from "../models/users.model";
import { Request, Response } from "express";
import { BaseCustomError } from "../utils/baseCustome";
import { StatusCode } from "../utils/statuscode";
import errorHandler from "../middlewares/errorHandler";
import { Token } from "../models/accountverification";
import { ObjectId } from "mongodb";
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

  //create
  async createUser(user: any): Promise<any> {
    try {
      const { email } = user;

      // Check if user with the same email already exists
      const existingUser = await this.getUserByEmail({ email });

      if (existingUser) {
        throw new BaseCustomError("Email already in use!", StatusCode.Conflict);
      }

      // Create the new user
      const userCreated = userModel.create(user);

      return (await userCreated).save();
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
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

  async getUserByEmail({ email }: { email: string }) {
    try {
      const existingUser = await userModel.findOne({ email: email });
      return existingUser;
    } catch (error: unknown) {
      throw null;
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
  async getTokentoDatabase(id: string, token: string) {
    try {
      const verify = new Token({ userId: id, token: token });
      
      return await verify.save();
    } catch (error) {
      throw error;
    }
  }

  async createTokenId(id: string, token: string) {
    try {
      return Token.create({ userId: id, token });
    } catch (error) {
      throw error;
    }
  }
  async deleteToken(token: string) {
    try {
      return await Token.deleteOne({ token: token });
    } catch (error) {
      throw error;
    }
  }
  async SignUp(newData: object) {
    try {
      return await userModel.create(newData);
    } catch (error) {
      throw new BaseCustomError("The email already use", StatusCode.OK);
    }
  }
}
