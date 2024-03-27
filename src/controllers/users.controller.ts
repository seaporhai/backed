import { userService } from "../Service/userService";
import { Post, Get, Route, Patch, Delete, Body, Path } from "tsoa";

export interface user {
  username: string;
  age: number;
}

@Route("users")
export class UsersController {
  private userService: userService;

  constructor() {
    this.userService = new userService();
  }
  @Get("/")
  public async getUsers(): Promise<any> {
    try {
      const searchUser = await this.userService.searchUser();

      return searchUser;
    } catch (error: any) {
      throw error;
    }
  }

  //get user by thier id
  @Get("/:id")
  public async GetUserById(@Path() id: string): Promise<any> {
    try {
      const user = await this.userService.SearchId(id);

      return user;
    } catch (error: any) {
      throw error;
    }
  }

  // Create the user
  @Post("/")
  public async createStudent(@Body() requestBody: user): Promise<void> {
    const { username, age } = requestBody;

    try {
      const student = await this.userService.addUser({
        username,
        age,
      });
      return student;
    } catch (error) {
      throw error;
    }
  }

  //Update the use using the ID
  @Patch("/:id")
  public async updateUser(
    @Path() id: string,
    @Body() data: user
  ): Promise<any> {
    try {
      const updated = await this.userService.updateUser(id, data);
      return updated;
    } catch (error: any) {
      throw error;
    }
  }

  //Delete User by thier Id
  @Delete("/:id")
  public async deleteUser(@Path() id: string): Promise<any> {
    try {
      const deleteUser = await this.userService.DeleteUser(id);
      return deleteUser;
    } catch (error: any) {
      throw error;
    }
  }
}