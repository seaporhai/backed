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
Route.post(
  "/",
  usevalidation(schema),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const userController = new UsersController();
      const newUser = await userController.createUser(req.body);
      res.status(StatusCode.Created).json({
        message: "POST success",
        user: newUser,
      });
    } catch (error) {
      _next(error);
    }
  }
); // Corrected middleware function name

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
