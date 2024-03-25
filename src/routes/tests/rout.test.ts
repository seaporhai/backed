import request from "supertest";
import { app } from "../../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectToDatabase from "../../utils/connecToDb";
import { StatusCode } from "../../utils/statuscode";
import { userRepo } from "../../repository/userRepo";

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
  });
  // Delete Rout
  test("DELETE /:id - Delete a specific student", async () => {
    // Create a new student
    const newStudent = await studentModel.create({
      name: "Mee Reak",
      age: 20,
      university: "Royal University of Phnom Penh",
    });

    // Make the request to delete the student
    const res = await request(app).delete(`/api/student/${newStudent._id}`);

    // Assert on response status
    expect(res.status).toBe(StatusCode.NoContent);

    // Ensure that the student is deleted from the database
    const deletedStudent = await studentModel.findById(newStudent._id);
    expect(deletedStudent).toBeNull(); // Expect the deleted student to be null (not found)
  });

  //Patch Rout
  test("Patch /:id - Update a specific book", async () => {
    // Create a new book
    const newStudent = await userRepo.createUser({
      name: "Mee Reak",
      age: 20,
    });

    // Make the request
    const res = await request(app)
      .patch(`/api/student/${newStudent.id}`)
      .send({ name: "Mee Reak", age: 2 });

    // Assert on response status and body
    expect(res.status).toBe(StatusCode.OK);
    expect(res.body).toEqual({
      student: {
        name: "Helllo",
        age: 23,
      },
    });
  });
});
