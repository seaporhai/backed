const userModel = require("../models/users.model");

export class userRepo {
  //search all
  async searchUser() {
    return await userModel.find({});
  }
  //by Id
  async SearchId(id: string) {
    return await userModel.findById(id);
  }
  //delete user id
  async DeleteUser(id: string) {
    return await userModel.findOneAndDelete({ _id: id });
  }
  //create
  async createUser(user: any): Promise<any> {
    return await userModel.create(user);
  }
  //update
  async updateUser(id: string, user: object) {
    return await userModel.findByIdAndUpdate(id, user, { new: true });
  }
}
