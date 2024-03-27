import request from "supertest";
import { app } from "../../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectToDatabase from "../../utils/connecToDb";
import { StatusCode } from "../../utils/statuscode";
import { userModel } from "../../models/users.model";
import exp from "constants";
import { ExpressTemplateService } from "tsoa";

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

  //Get Rout
  test("Get / user Should Find all User", async () => {
    const response = await request(app).get("/users");
    expect(response.body.message).toEqual("GET success!");
  }),
    //get by id
    test("Get / user by id ", async () => {
      const user = await userModel.create({
        username: "Hia",
        age: 20,
      });
      const res = await request(app).get(`/users/${user._id}`);
      expect(res.status).toBe(StatusCode.OK);
    });
  //Patch Rout
  test("Patch /:id - Update a specific user", async () => {
    const newStudent = await userModel.create({
      username: "Leeminhai",
      age: 20,
    });
    // Make the request
    const res = await request(app)
      .patch(`/users/${newStudent.id}`)
      .send({ username: "Leeminhoo", age: 10 });
    // Assert on response status and body
    expect(res.status).toBe(StatusCode.OK);

  });

  //Delete by Id

  test("Delete/:id", async () => {
    const newStudent = await userModel.create({
      username: "Ling",
      age: 19,
    });
    //response
    const res = await request(app).delete(`/users/${newStudent._id}`);
    expect(res.status).toBe(StatusCode.NoContent);
    //make sure that the user was delete
    const deleteUser = await userModel.findById(newStudent._id);
    expect(deleteUser).toBeNull();
  });
});
