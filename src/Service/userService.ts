import { userRepo } from "../repository/userRepo";
import { User } from "../types/users";
export class userService {
  static DeleteUser: any;
  static updateUser(id: string, data: User) {
    throw new Error("Method not implemented.");
  }
  static addUser(userData: User) {
    throw new Error("Method not implemented.");
  }
  static SearchId(id: string) {
    throw new Error("Method not implemented.");
  }
  static searchUser() {
    throw new Error("Method not implemented.");
  }
  findOneUser(id: string) {
    throw new Error("Method not implemented.");
  }
  repo: userRepo;
  User: { username: any; age: any } | undefined;
  constructor() {
    this.repo = new userRepo();
  }
  //search
  async searchUser() {
    return await this.repo.searchUser();
  }
  // search ID
  async SearchId(id: string) {
    return await this.repo.SearchId(id);
  }
  // delete user
  async DeleteUser(id: string) {
    return await this.repo.DeleteUser(id);
  }
  //add user
  async addUser(userDatail: any): Promise<any> {
    return await this.repo.createUser(userDatail);
  }
  //update
  async updateUser(id: string, user: object) {
    return await this.repo.updateUser(id, user);
  }
}
