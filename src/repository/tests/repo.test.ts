import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { userRepo } from "../userRepo";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start(); // Start the server explicitly
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("UserRepo", () => {
  let newUserRepo: userRepo;

  beforeEach(() => {
    newUserRepo = new userRepo();
  });

  describe("User Repository", () => {
    //create new student testing
    test("should create a new student", async () => {
      const student = {
        username: "Hello world",
        age: 20,
        email:"seanghai@gmail.com",
        password: "012909090"
      };
      const newUser = await newUserRepo.createUser(student);
      //assertion
      expect(newUser).toBeDefined();
      expect(newUser.username).toBe(student.username);
      expect(newUser.age).toBe(student.age);
      expect(newUser.email).toBe(student.email);
      expect(newUser.age).toBe(student.age);

      //check if the student is saved in the database
      const foundUser = await newUserRepo.SearchId(newUser.id);
      expect(foundUser).toBeDefined();
      expect(foundUser?.username).toEqual(newUser.username);
    });
    ///delete test
    test("Delete a student", async () => {
      const student = {
        username: "Hello world",
        age: 20,
      };
      const newUser = await newUserRepo.createUser(student);

      const deleteUser = await newUserRepo.DeleteUser(newUser.id);

      const foundUser = await newUserRepo.SearchId(newUser.id);

      expect(foundUser).toBeNull();
    });



    // test("update a student", async () => {
    //   const student = {
    //     username: "Hello world",
    //     age: 20,
    //   };
    //   const newUser = await newUserRepo.createUser(student);
    //   const updateStudent = {
    //     username: "Hello",
    //     age: 10,
    //   };
    //   const update = await newUserRepo.updateUser(newUser.id, updateStudent);
    //   expect(update).toBeDefined();
    //   expect(update.username).toBe(updateStudent.username);
    //   expect(updateStudent.age).toBe(updateStudent.age);
    //   const foundUser = await newUserRepo.SearchId(update.id);
    //   expect(foundUser.username).toBe(updateStudent.username);
    // });
    test("search all student", async () => {
      const student = {
        username: "Hello world",
        age: 20,
        _id: new mongoose.Types.ObjectId("4edd40c86762e0fb12000003"),
      };
      const newUser = await newUserRepo.createUser(student);
      expect(newUser).toBeDefined();
      expect(newUser._id).toBeDefined();
      expect(newUser.username).toEqual(student.username);
    });
  });
//shopw student by ID
  // test("Show student by id", async () => {
  //   const student = {
  //     username: "John Doe",
  //     age: 20,
  //   };

  //   //add that student to database
  //   const newUser = await userRepo.adduser(student);

  //   //find that student
  //   const findUser = userRepo.showStudentById(newUser.);

  //   // Assertions;
  //   expect(findUser).toBeDefined();
  //   expect(findUser?.id).toBe(newUser.id);
  //   expect(findUser?.username).toBe(student.username);
  //   expect(findUser?.age).toBe(student.age);
  // });
});
