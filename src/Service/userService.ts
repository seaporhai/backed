import { userRepo } from "../repository/userRepo";
import { User } from "../types/users";
import { generateToken, hashedPassword } from "../utils/JWT";
import { Token } from "../models/accountverification";
import { ObjectId } from "mongodb";
import { StatusCode } from "../utils/statuscode";
import { BaseCustomError } from "../utils/baseCustome";
import { sendVerificationEmail } from "../utils/sendingVerification";
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

      return await this.repo.SignUp(newUsers);
    } catch (error) {
      throw error; // Rethrow the error or handle it appropriately
    }
  }

  // Update user
  async updateUser(id: string, user: User): Promise<any> {
    return await this.repo.updateUser(id, user);
  }

  // async gettokentoDB(token: string, id: string): Promise<any> {
  //   const accountVerification = this.repo.createTokenId(token, id);

  //   return accountVerification;

  // }
  async SendVerifyEmail(userId: string, token: string, email: string) {
    try {
      // const token = generateToken();
      await sendVerificationEmail(email, token);
      await this.repo.createTokenId({ userId, token });
    } catch (error: unknown) {
      console.log("Error in sending verification Email", error);
      throw error;
    }
  }
  async verifyAccount(token: string) {
    const isTk = await this.repo.findToken(token);
    if (!isTk) {
      throw new BaseCustomError(
        "Verified Token Is inValid",
        StatusCode.BadRequest
      );
    }
    const User = await this.repo.SearchId(isTk.id);
    if (!User) {
      throw new BaseCustomError("Not Found", StatusCode.NotFound);
    }
    User.isVerified = true;
    await User.save();
    await this.repo.deleteToken(token);
    return User;
  }
}
