import { Router, Request, Response, NextFunction } from "express";
import { validateMongooseId } from "../middlewares/mongoose";
import express from "express";
import { UseSchema } from "../schema/useschema";
import { usevalidation } from "../middlewares/usevalidation"; // Corrected spelling
import { ZodSchema } from "zod";
import { UsersController } from "../controllers/users.controller";
import { userService } from "../Service/userService";
import { StatusCode } from "../utils/statuscode";
import { BaseCustomError } from "../utils/baseCustome";

const Route: Router = express.Router(); // Set type of Route as Router
const schema: ZodSchema = UseSchema; // Set type of schema as object
const usersControllers = new UsersController();

// get all users
Route.get("/", async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const controller = new UsersController();
    const response = await controller.getUsers();

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
      const response = await controller.GetUserById(id);

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
      const newUser = await userController.createStudent(req.body);
      res.status(StatusCode.OK).send({ users: { newUser } });
    } catch (error) {
      _next(error);
    }
  }
); // Corrected middleware function name

//update user
// Route.patch("/:id", validateMongooseId, usersControllers.updateUser);

//delete user
// Route.delete("/:id", validateMongooseId, usersControllers.deleteUser);

export { Route };
