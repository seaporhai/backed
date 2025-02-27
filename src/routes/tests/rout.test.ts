import request from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectToDatabase from "../../utils/connecToDb";
import { StatusCode } from "../../utils/statuscode";
import { userModel } from "../../models/users.model";
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

describe("/users", () => {
  let userId: string;
  test("POST /  should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        username: "testhhh",
        age: 7,
        email: "seanghau@gmail.com",
        password: "2323232323",
      })
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");

    // mongoServer = response.body.data._id;
    console.log("Response", response.body);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("POST success");
    expect(response.body.user.username).toEqual("testhhh");
    expect(response.body.user.age).toEqual(7);
    expect(response.body.user.email).toEqual("seanghau@gmail.com");
    expect(response.body.user.password).toEqual("2323232323");
    userId = response.body.user._id;
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
        email: "seanghau@gmail.com",
        password: "2323232323",
      });
      const res = await request(app).get(`/users/${user._id}`);
      expect(res.status).toBe(StatusCode.OK);
    });
  //Patch Rout
  test("Patch /:id - Update a specific user", async () => {
    const newStudent = await userModel.create({
      username: "Leeminhai",
      age: 20,
      email: "leemin@gmail.com",
      password: "029382922",
    });
    const res = await request(app).patch(`/users/${newStudent.id}`).send({
      username: "Leeminhoo",
      age: 10,
      email: "leemin@gmail.com",
      password: "029382922",
    });
    expect(res.status).toBe(StatusCode.OK);
  });

  //Delete by Id
  test("Delete /users/:id should delete a user by id", async () => {
    const res = await request(app)
      .delete(`/users/${userId}`) // use stored userId
      .expect(StatusCode.OK); // use StatusCode.OK directly

    expect(res.body.message).toEqual("User deleted successfully");
  });
});
