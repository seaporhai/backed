import { userModel } from "../models/users.model";
import { Request, Response } from "express";
import { BaseCustomError } from "../utils/baseCustome";
import { StatusCode } from "../utils/statuscode";
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
  //delete user id
  async DeleteUser(id: string) {
    return await userModel.findOneAndDelete({ _id: id });
  }
  //create
  async createUser(user: any): Promise<any> {
    return await userModel.create(user);
  }
  //update
  async updateUser(id: string, user: object) {
    return await userModel.findByIdAndUpdate(id, user, { new: true });
  }
}
