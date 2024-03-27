import { NextFunction, Request, Response } from "express";
import { User } from "../types/users";
import { BaseCustomError } from "../utils/baseCustome";
import { userService } from "../Service/userService";
import { StatusCode } from "../utils/statuscode";
import { Post, Get, Route, Patch, Delete, Body, Path } from "tsoa";
import { string } from "zod";

export interface user {
  username: string;
  age: number;
}

@Route("users")
export class UsersController {
  private userService: userService;

  constructor() {
    this.userService = new userService();
  }
  @Get("/")
  public async getUsers(): Promise<any> {
    try {
      const searchUser = await this.userService.searchUser();

      return searchUser;
    } catch (error: any) {
      throw error;
    }
  }

  //get user by thier id
  @Get("/:id")
  public async GetUserById(@Path() id: string): Promise<any> {
    try {
      const user = await this.userService.SearchId(id);

      return user;
    } catch (error: any) {
      throw error;
    }
  }

  // Create the user
  @Post("/")
  public async createStudent(@Body() requestBody: user): Promise<void> {
    const { username, age } = requestBody;

    try {
      const student = await this.userService.addUser({
        username,
        age,
      });
      return student;
    } catch (error) {
      throw error;
    }
  }

  //Update the use using the ID
  // @Patch("/id")
  // public updateUser = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const { id } = req.params;
  //     const data: User = {
  //       username: req.body.username,
  //       age: req.body.age,
  //     };
  //     const updated = await this.userService.updateUser(id, data);
  //     res.status(StatusCode.OK).json(updated);
  //   } catch (error: any) {
  //     next(new Error("Internal Server Error"));
  //   }
  // };

  //Delete User by thier Id
  // @Delete("/id")
  // public deleteUser = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const { id } = req.params;
  //     const deleteUser = await this.userService.DeleteUser(id);
  //     res.status(StatusCode.NoContent).json({
  //       message: "Delete successful!",
  //       error: false,
  //       data: deleteUser,
  //     });
  //   } catch (error: any) {
  //     next(new Error("Internal Server Error"));
  //   }
  // };
}
