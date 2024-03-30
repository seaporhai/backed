import { userRepo } from "../repository/userRepo";
import { User } from "../types/users";
import { userModel } from "../models/users.model";
import { hash } from "bcrypt";
import { hashedPassword } from "../utils/JWT";
import { StatusCode } from "../utils/statuscode";
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

        // Hash password using bcrypt
        const hashPassword = await hashedPassword(password, 10);
        
        // Create a new object with hashed password
        const userWithHashedPassword = { ...userData, password: hashPassword };
        
        // Create user with hashed password
        return await this.repo.createUser(userWithHashedPassword);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error; // Rethrow the error or handle it appropriately
      
      }
}

  // Update user
  async updateUser(id: string, user: User): Promise<any> {
    return await this.repo.updateUser(id, user);
  }
}
