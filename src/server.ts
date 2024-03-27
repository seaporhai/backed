import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { Route } from "./routes/users.route";
import cors from "cors";
import morgan from "morgan";
import connectToDatabase from "./utils/connecToDb";
import requestTimeMiddleware from "./middlewares/requestTime";
import errorHandler from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";

dotenv.config();
export const app = express();

// Global Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(requestTimeMiddleware);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const PATH = "/users";
app.use(PATH, Route);

// Catch-all route for handling unknown routes
app.all("*", (req: Request, res: Response, _next: NextFunction) => {
  _next(new Error(`page could be not found!`));
});
// Error handling middleware
app.use(errorHandler);
const PORT = process.env.PORT;

// Connect to database
connectToDatabase();

app.listen(PORT, () => {
  console.log(`[Server] is running on port ${PORT} and PATH ${PATH}`);
});
