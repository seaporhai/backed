import { userRepo } from "../repository/userRepo";
import { User } from "../types/users";
import { userModel } from "../models/users.model";

export class UserService {
  private repo: userRepo;

  constructor() {
    this.repo = new userRepo();
  }

  // Search users
  async searchUser(req: any): Promise<any> {
    return await this.repo.searchUser(req);
  }

  // Search user by ID
  async searchId(id: string): Promise<any> {
    return await this.repo.SearchId(id);
  }

  // Delete user
  async deleteUser(id: string): Promise<any> {
    return await this.repo.DeleteUser(id);
  }

  // Add user
  async addUser(userData: any): Promise<any> {
    try {
      const newUser = await userModel.create(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  }
  

  // Update user
  async updateUser(id: string, user: User): Promise<any> {
    return await this.repo.updateUser(id, user);
  }
}
