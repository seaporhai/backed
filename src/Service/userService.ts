import { userRepo } from "../repository/userRepo";
import { User } from "../types/users";
import { userModel } from "../models/users.model";
import { hash } from "bcrypt";
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
      const { username, age, password, email } = userData;

      const hashedPassword = await hash(password, 10); // Hash password using bcrypt
      // Update password with hashed password
      // Save the user with hashed password
      const newUser = await this.repo.createUser({
        username,
        age,
        email,
        password: hashedPassword,
      });
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
