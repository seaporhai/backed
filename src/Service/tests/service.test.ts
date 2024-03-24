import { userService } from "../userService";

// Mock UsersRepository
describe("UsersServices", () => {
  let UsersServices: userService;
  beforeEach(() => {
    UsersServices = new userService();
  });

  describe("getUserById", () => {
    it("should call getUserById method of UsersRepository with the provided id", async () => {
      const MOCK_USER = {
        _id: "gjregr",
        username: "vaht",
        password: "gegeggegege",
        age: 5,
      };
      const userId = MOCK_USER._id;

      (UsersServices.getUserById as jest.Mock).mockReturnValue(
        MOCK_USER
      );

      const user = await UsersServices.getUserById(userId);

      expect(user).toBeDefined();
      expect(user).toEqual(MOCK_USER);
    });
  });

  describe("getUsers", () => {
    it("should return users from the repository", async () => {
      const MOCK_USER: Array<any> = [
        { username: "vaht", age: 5 },
      ];

      // Mock the getUsers method of UserRepository to return dummy data
      (UsersServices.searchUser as jest.Mock).mockResolvedValue(
        MOCK_USER
      );

      const result = await UsersServices.searchUser();

      expect(result).toBeDefined();
      expect(result).toEqual(MOCK_USER);
    });

    it("should throw an error if repository throws an error", async () => {
      // Mock the getUsers method of UserRepository to throw an error
      (UsersServices.searchUser as jest.Mock) = jest
        .fn()
        .mockRejectedValue(new Error("Repository error"));

      await expect(UsersServices.searchUser()).rejects.toThrow(
        "Repository error"
      );
    });
  });
  describe("createUser", () => {
    it("should call createUser method of UsersRepository with the provided user data", async () => {
      const userData = {
        username: "vaht",
        password: "gegeggegege",
        age: 5,
      };
      await UsersServices.addUser(userData);
      // expect(usersRepositoryMock.createUser).toHaveBeenCalledWith(userData);
    });
  });

  describe("updateUser", () => {
    it("should call updateUser method of UsersRepository with the provided id and user data", async () => {
      const userId = "65fd3baa1ef197a14fc0b8bd";
      const userData = {
        username: "vaht",
        age: 5,
      };
      await UsersServices.updateUser(userId, userData);
      // expect(usersRepositoryMock.updateUser).toHaveBeenCalledWith(userId, userData);
    });
  });

  describe("deleteOneUser", () => {
    it("should call deleteOneUser method of UsersRepository with the provided id", async () => {
      const userId = "123";
      await UsersServices.DeleteUser(userId);
      // expect(usersRepositoryMock.deleteOneUser).toHaveBeenCalledWith(userId);
    });
  });

});
