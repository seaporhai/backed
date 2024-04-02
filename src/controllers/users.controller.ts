import { UserService } from "../Service/userService";
import {
  Post,
  Get,
  Route,
  Patch,
  Delete,
  Body,
  Path,
  Query,
  Queries,
  SuccessResponse,
} from "tsoa";
import { userModel } from "../models/users.model";
import { BaseCustomError } from "../utils/baseCustome";
import { StatusCode } from "../utils/statuscode";
import { PaginateType } from "../routes/@types/Paginate";
import { sendVerificationEmail } from "../utils/sendingVerification";
import { generateToken } from "../utils/JWT";
import { token } from "morgan";
import Mail from "nodemailer/lib/mailer";

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

interface Options {
  page?: number;
  limit?: number;
  skip?: number;
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
      return { user: usersData, paginate: pagination };
    } catch (error: any) {
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
  public async createUser(@Body() requestBody: User): Promise<void> {
    try {
      const { username, age, email, password } = requestBody;

      const userService = new UserService();
      const newUser = await userService.addUser({
        username,
        age,
        email,
        password,
      });
      const Gtoken = generateToken();
      const dateline = generateToken();
      sendVerificationEmail(email, Gtoken  );
      await userService.gettokentoDB(newUser._id);
      return newUser;
    } catch (error: any) {
      console.error("Error creating user:", error);
      throw new BaseCustomError(
        "An error occurred while creating user",
        StatusCode.InternalServerError
      );
    }
  }

  // Update user by their ID
  @Patch("/:id")
  public async updateUser(
    @Path() id: string,
    @Body() users: User
  ): Promise<any> {
    try {
      const updatedUser = await this.userService.updateUser(id, users);
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
}
