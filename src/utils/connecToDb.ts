import mongoose from "mongoose";

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/class");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

export default connectToDatabase;

