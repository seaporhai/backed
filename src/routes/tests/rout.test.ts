import request from "supertest";
import { app } from "../../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

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
  it("should create a new user when provided with valid input", async () => {
    const student = {
      username: "Hello world",
      age: 20,
    };
    const response = await request(app)
      .post("/users")
      .send(student)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.username).toBe(student.username);
    expect(response.body.age).toBe(student.age);
    expect(response.body.token).toBeDefined();
  }, 10000); // Reduced timeout to 10 seconds
});
