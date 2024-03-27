import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import requestTimeMiddleware from "./middlewares/requestTime";
import errorHandler from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";
import { Route } from "./routes/users.route";

dotenv.config();
export const app: Express = express();
const PATH = "/users";
// Global Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(requestTimeMiddleware);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// global route

app.use(PATH, Route);

// Catch-all route for handling unknown routes
app.all("*", (req, res, _next) => {
  _next(new Error(`page could not be found!`));
});
// Error handling middleware
app.use(errorHandler);

// Exporting app for server
export default app;
