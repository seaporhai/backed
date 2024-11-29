import { userRepo } from "../repository/userRepo";
import { User } from "../types/users";
import {
  generateToken,
  generateTokenJWT,
  hashedPassword,
  verifyPassword,
} from "../utils/JWT";
import { Token } from "../models/accountverification";
import { ObjectId } from "mongodb";
import { StatusCode } from "../utils/statuscode";
import { BaseCustomError } from "../utils/baseCustome";
import { sendVerificationEmail } from "../utils/sendingVerification";
import { string } from "zod";
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
    try {
      // Find token in the repository
      const tokenInfo = await this.repo.findToken(token);

      // If token doesn't exist, throw an error
      if (!tokenInfo) {
        throw new BaseCustomError(
          "Verification Token Is Invalid",
          StatusCode.BadRequest
        );
      }

      // Check token expiration
      const expirationDate = new Date(tokenInfo.expiresAt);
      const expirationDurationMinutes = 10; // Set expiration duration to 10 minutes
      expirationDate.setMinutes(
        expirationDate.getMinutes() + expirationDurationMinutes
      );
      const now = new Date();
      if (now > expirationDate) {
        // Token has expired
        await this.repo.deleteToken(token); // Delete the expired token
        const user = await this.repo.SearchId(tokenInfo.userId);
        if (!user) {
          throw new BaseCustomError("User Not Found", StatusCode.NotFound);
        }
        const newToken = generateToken(); // Generate new token
        const newAccount = new Token({
          token: newToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + expirationDurationMinutes * 60000), // Set new expiration time
        });
        await newAccount.save();
        await sendVerificationEmail(user.id, newToken);
        throw new BaseCustomError(
          "Verification token has expired. A new verification email has been sent.",
          StatusCode.NotFound
        );
      }

      // Token is still valid
      const user = await this.repo.SearchId(tokenInfo.userId);
      if (!user) {
        throw new BaseCustomError("User Not Found", StatusCode.NotFound);
      }

      // Update user's verification status
      user.isVerified = true;
      await user.save();

      // Delete the token
      await this.repo.deleteToken(token);

      return user;
    } catch (error) {
      console.error("Error verifying account:", error);
      throw error;
    }
  }

  async Login(email: string, password: string) {
    const user = await this.repo.getUserByEmail({ email });
    console.log({ message: "", user });
    if (!user) {
      throw new BaseCustomError(
        "Invalid Username or Password",
        StatusCode.NotFound
      );
    }
    if (user.isVerified === false) {
      throw new BaseCustomError(
        "This user is not Verify yet , Please Check your Email to Verify!!",
        StatusCode.NotFound
      );
    }

    // await verifyPassword(password, user.password);
    const TOKEN = generateTokenJWT({ id: user.id });
    return TOKEN;
  }
}
