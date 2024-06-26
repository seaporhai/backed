import { Router, Request, Response, NextFunction, query } from "express";
import { validateMongooseId } from "../middlewares/mongoose";
import express from "express";
import { UseSchema } from "../schema/useschema";
import { usevalidation } from "../middlewares/usevalidation"; // Corrected spelling
import { ZodSchema } from "zod";
import { UsersController } from "../controllers/users.controller";
import { StatusCode } from "../utils/statuscode";
import { BaseCustomError } from "../utils/baseCustome";
import { Query } from "tsoa";
import { Options } from "./@types/userRout";
import { Token } from "../models/accountverification";
import { userModel } from "../models/users.model";
import { generateToken } from "../utils/JWT";
import { token } from "morgan";
import { UserService } from "../Service/userService";

const Route: Router = express.Router(); // Set type of Route as Router
const userController = new UsersController();

const schema: ZodSchema = UseSchema; // Set type of schema as object

// get all users
Route.get("/", async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const controller = new UsersController();
    const { page = 1, limit = 3 } = req.query;
    const options: Options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      skip: 0,
    };
    const response = await userController.getUsers(options);
    if (!response) {
      throw new Error("No user found!");
    }
    res.status(StatusCode.OK).json({
      message: "GET success!",
      data: response,
    });
  } catch (error: unknown) {
    if (error instanceof BaseCustomError)
      _next(new BaseCustomError(error.message, StatusCode.NotFound));
  }
});

Route.get(
  "/verify",
  // async (req: Request, res: Response, _next: NextFunction) => {
  //   const { token } = req.query;
  //   // console.log(token);
  //   try {
  //     const isToken = await Token.findOne({ token });

  //     if (!isToken) {
  //       throw new BaseCustomError(
  //         "Verification token is invalid",
  //         StatusCode.BadRequest
  //       );
  //     }
  //     console.log(isToken);
  //     const userId = isToken.userId;
  //     const user = await userModel.findById(userId);

  //     if (!user) {
  //       throw new BaseCustomError("User does not exist.", StatusCode.NotFound);
  //     }
  //     console.log(user);

  //     // Mark the user's email as verified
  //     user.isVerified = true;
  //     await user.save();

  //     // Remove the verification token
  //     await Token.deleteOne({ token });

  //     return res
  //       .status(StatusCode.OK)
  //       .json({ message: "User verified successfully" });
  //   } catch (error: any) {
  //     _next(error);
  //     // return res
  //     //   .status(StatusCode.InternalServerError)
  //     //   .json({ message: error.message });
  //   }
  // }
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.query.token as string; // Assuming the token is passed as a query parameter
      await userController.VerifyEmail(token);
      return res.status(StatusCode.Found).json("Successfully verify");
    } catch (error: any) {
      res.status(StatusCode.BadRequest).json({ message: error.message });
    }
  }
);

//get one user
Route.get(
  "/:id",
  validateMongooseId,
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const controller = new UsersController();
      const { id } = req.params;
      const response = await controller.getUserById(id);

      if (!response) {
        throw new Error("User not found");
      } else {
        res.status(StatusCode.OK).json({ response });
      }
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        _next(new BaseCustomError(error.message, StatusCode.NoContent));
      }
    }
  }
);

//create user
Route.post("/", async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // Extract user data from request body
    const user = req.body;

    // Call createUser method in UsersController to create the user
    const newUser = await userController.createUser(user);

    // Send response with the newly created user
    res.status(201).json({
      message: `Success Created user , Hello ${req.body.username} please verify your email to log in  `,
    });
  } catch (error) {
    _next(error);
  }
});

Route.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const userinput = await userController.login(req.body)

    const user = await userController.login(req.body);

      res.status(StatusCode.OK).json({ message: "Login successful", user });
    } catch (error) {
      next(error);
    }
    // try {
    //   // Extract email and password from request body
    //   const { email, password } = req.body;
    //   // Call login method in UsersController to authenticate user

    //   // Return token upon successful login
    //   res.status(StatusCode.OK).json({ message: "Login successful", userinput });
    // } catch (error) {
    //   // Pass error to error handling middleware
    //   next(error);
    // }
  }
);

//update user
Route.patch(
  "/:id",
  validateMongooseId,
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const id = req.params.id; // Extract id from request parameters
      const userController = new UsersController();
      const data = {
        username: req.body.username,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password,
      };
      const newUser = await userController.updateUser(id, data); // Removed extra closing parenthesis
      res.status(StatusCode.OK).send({ users: { newUser } });
    } catch (error) {
      // Added error parameter
      _next(new Error("Internal Server Error"));
    }
  }
);

//delete user
Route.delete(
  "/:id",
  validateMongooseId,
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { id } = req.params;
      const userController = new UsersController();
      const response = await userController.deleteUser(id);
      res.status(StatusCode.OK).json({
        message: "Delete success",
        error: false,
        data: response,
      });
    } catch {
      _next(new Error("Internal Server Error"));
    }
  }
);

export { Route };
