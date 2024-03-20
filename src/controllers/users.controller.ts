import { NextFunction, Request, Response } from "express";
import { User } from "../types/users";
import { BaseCustomError } from "../utils/baseCustome";
import { userService } from "../Service/userService";
import { StatusCode } from "../utils/statuscode";

export const usersControllers = {
  getUsers: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const UserService = new userService();
      const searchUser = await UserService.searchUser();
      if (!searchUser) {
        throw new Error("No user found!");
      }
      res.status(StatusCode.OK).json({
        message: "GET success!",
        data: searchUser,
      });
      // Log user request time
    } catch (error: any) {
      _next(new BaseCustomError(error.message, StatusCode.NotFound));
    }
  },

  getUserById: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const UserService = new userService();
      const { id } = req.params;
      const userId = await UserService.SearchId(id);
      if (!userId) {
        throw new Error("User not found");
      } else {
        res.status(StatusCode.OK).json({ userId });
      }
    } catch (error: any) {
      _next(new BaseCustomError(error.message, StatusCode.NotFound));
    }
  },

  createUsers: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    // try {
    //   const UserService = new userService();
    //   const userData: User = {
    //     username: req.body.username,
    //     age: req.body.age,
    //   };
    //   const user = await UserService.a  ddUser(userData);
    //   res.json(user);
    // } catch (error) {
    //   _next(new Error("Internal Server Error"));
    // }

    const Post = new userService();

    const userData: User = {
      username: req.body.username,
      age: req.body.age,
    };
    const add = await Post.addUser(userData);
    res.json({ add });
  },

  updateUser: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const UserService = new userService();
      const { id } = req.params;
      const data: User = {
        username: req.body.username,
        age: req.body.age,
      };
      const updated = await UserService.updateUser(id, data);
      res.json(updated);
    } catch (error) {
      _next(new Error("Internal Server Error"));
    }
  },

  deleteUser: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const UserService = new userService();
      const { id } = req.params;
      const deleteUser = await UserService.DeleteUser(id);
      res.json({
        message: "Delete successful!",
        error: false,
        data: deleteUser,
      });
    } catch (error) {
      _next(new Error("Internal Server Error"));
    }
  },
};
