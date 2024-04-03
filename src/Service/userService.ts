import { userRepo } from "../repository/userRepo";
import { User } from "../types/users";
import { generateToken, hashedPassword } from "../utils/JWT";
import { Token } from "../models/accountverification";
import { ObjectId } from "mongodb";
import { StatusCode } from "../utils/statuscode";
import { BaseCustomError } from "../utils/baseCustome";
export class UserService {
  // login(arg0: { username: string; age: number; email: string; password: string; status: string; message: string; }) {
  //   throw new Error("Method not implemented.");
  // }
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
      const newUsers = await this.repo.createUser({
        username,
        age,
        email,
        password: hashPassword,
      });

      if (!newUsers) {
        throw new BaseCustomError(
          "Unable to create user in database",
          StatusCode.InternalServerError
        );
      }

      // Create user with hashed password
      return newUsers;
    } catch (error) {
      throw error; // Rethrow the error or handle it appropriately
    }
  }

  // Update user
  async updateUser(id: string, user: User): Promise<any> {
    return await this.repo.updateUser(id, user);
  }

  async gettokentoDB(token: string, id: string): Promise<any> {
    const accountVerification = this.repo.getTokentoDatabase(token, id);
    return (await accountVerification).save();
  }

  async VerifyUser(id: string, token: string) {
    const isToken: any = await this.repo.createTokenId(id, token);

    if (!isToken) {
      throw new BaseCustomError(
        "Verification token is invalid",
        StatusCode.BadRequest
      );
    }

    const userId = isToken.id;
    // Find the user associated with this token
    const user = await this.repo.SearchId(userId);
    if (!user) {
      throw new BaseCustomError("User does not exist.", StatusCode.NotFound);
    }

    // Mark the user's email as verified
    user.isVerified = true;
    await user.save();

    // Remove the verification token
    await this.repo.deleteToken(token);
    return user;
  }
  async SignUp(newData: object) {
    return await this.repo.SignUp(newData);
  }

  
  async saveToken(id : string, token: string) {
    try {
      const newToken = new Token({ id, token });
      await newToken.save();
      return { success: true, message: 'Token saved successfully' };
    } catch (error) {
      console.error('Error saving token:', error);
      return { success: false, error: 'Failed to save token' };
    }
  }

}
