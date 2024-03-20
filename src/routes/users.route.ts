import { Router, Request, Response } from "express";
import { usersControllers } from "../controllers/users.controller";
import { validateMongooseId } from "../middlewares/mongoose";
import express from "express";
import { UseSchema } from "../schema/useschema";
import { usevalidation } from "../middlewares/usevalidation"; // Corrected spelling
import { ZodSchema, object } from "zod";
import mongoose from "mongoose";

const Route: Router = express.Router(); // Set type of Route as Router
const schema: ZodSchema = UseSchema; // Set type of schema as object

// get all users
Route.get("/", usersControllers.getUsers);

//get one user
Route.get("/:id", validateMongooseId, usersControllers.getUserById);

//create user
Route.post("/", usevalidation(schema), usersControllers.createUsers); // Corrected middleware function name

//update user
Route.patch("/:id", validateMongooseId, usersControllers.updateUser);

//delete user
Route.delete("/:id", validateMongooseId, usersControllers.deleteUser);

export { Route };
