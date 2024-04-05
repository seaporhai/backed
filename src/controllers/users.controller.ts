import { UserService } from "../Service/userService";
import {
  Post,
  Get,
  Route,
  Patch,
  Delete,
  Body,
  Path,
  Queries,
  SuccessResponse,
  Query,
} from "tsoa";
import { userModel } from "../models/users.model";
import { BaseCustomError } from "../utils/baseCustome"; // Fixed typo
import { StatusCode } from "../utils/statuscode";
import { PaginateType } from "../routes/@types/Paginate";
import { sendVerificationEmail } from "../utils/sendingVerification";
import { generateToken, hashedPassword } from "../utils/JWT";
import { string } from "zod";
import { Token } from "../models/accountverification";

// Define user interface
export interface User {
  username: string;
  age: number;
  email: string;
  password: string;
}

// Define query parameters interface
interface UserQuery {
  page?: number;
  limit?: number;
}

@Route("/users")
export class UsersController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
  
  // Get users with pagination
  @Get("/")
  public async getUsers(@Queries() query: UserQuery): Promise<any> {
    try {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const usersData = await userModel.find().skip(skip).limit(limit).exec();

      const totalDocuments: number = await userModel.countDocuments();
      const totalPages: number = Math.ceil(totalDocuments / limit);

      if (!usersData) {
        throw new BaseCustomError("No Data", StatusCode.NotFound);
      }

      const pagination: PaginateType = {
        currentPage: page,
        totalPages: totalPages,
        totalDocuments: totalDocuments,
      };

      return { users: usersData, paginate: pagination }; // Changed 'user' to 'users' for consistency
    } catch (error: any) {
      throw error;
    }
  }
  @Post("/login")
  public async login(@Body() requestBody: { email: string; password: string }) {
    try {
      const { email, password } = requestBody; 
      console.log(email , password) ;

      // return this.userService.Login(email, password);
    } catch (error) {
      throw error;
    }
  }

  // Get user by their ID
  @Get("/:id")
  public async getUserById(@Path() id: string): Promise<any> {
    try {
      const user = await this.userService.searchId(id);
      return user;
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
    }
  }

  // Create a new user
  @Post("/")
  public async createUser(@Body() requestBody: User): Promise<string> {
    try {
      const { username, age, email, password } = requestBody;
      const userService = new UserService();
      const hashPassword = await hashedPassword(password, 10);

      const newUser = await userService.addUser({
        username,
        age,
        email,
        password: hashPassword,
      });
      const Tokenn = generateToken();
      await this.userService.SendVerifyEmail(newUser._id, Tokenn, email);

      return newUser;
    } catch (error: any) {
      throw error;
    }
  }



  // Update user by their ID
  @Patch("/:id")
  public async updateUser(
    @Path() id: string,
    @Body() user: User // Changed parameter name from 'users' to 'user' for consistency
  ): Promise<any> {
    try {
      const updatedUser = await this.userService.updateUser(id, user);
      return updatedUser;
    } catch (error: any) {
      throw error;
    }
  }

  // Delete user by their ID
  @Delete("/:id")
  public async deleteUser(@Path() id: string): Promise<any> {
    try {
      const deletedUser = await this.userService.deleteUser(id);
      return deletedUser;
    } catch (error: any) {
      throw error;
    }
  }

  // @Get("/verify")
  // public async verifyUser(@Query() token: string): Promise<any> {
  //   try {
  //     // Find the token in the database
  //     const tokenDoc = await Token.findOne({ token });
  //     if (!tokenDoc) {
  //       throw new Error("Invalid token");
  //     }

  //     // Update the user's isVerified status
  //     const user = await Token.findById(tokenDoc.userId);
  //     if (!user) {
  //       throw new Error("User not found");
  //     }
  //     user.isVerified = true;
  //     await user.save();

  //     // Delete the token from the database
  //     await Token.deleteOne({ token });

  //     return { message: "User verified successfully" };
  //   } catch (err: any) {
  //     throw new Error(err.message);
  //   }
  // }
}
