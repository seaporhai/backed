import request from "supertest";
import { app } from "../../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectToDatabase from "../../utils/connecToDb";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await connectToDatabase();
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

      // mongoServer = response.body.data._id;
      expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("POST success");
    expect(response.body.data.username).toEqual("test");
    expect(response.body.data.age).toEqual(7);
  }); // Reduced timeout to 10 seconds
   test("Get / user Should Find all User" , async ()=>{
    const response = await request(app)
    .get('/users');
    console.log (response.body)
    expect(response.body.message).toEqual( 'GET success!')
   })
});
