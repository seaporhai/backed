import request from "supertest";
import { app } from "../../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Route } from "../users.route";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST/users", () => {
  test("POST /users should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        username: "test",
        age: 7,
      })
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");

     mongoServer = response.body.data._id;
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toEqual("POST success");
    expect(response.body.data.username).toEqual("test");
    expect(response.body.data.age).toEqual(7);
  }); // Reduced timeout to 10 seconds
});
