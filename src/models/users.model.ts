import mongoose, { Schema, Document } from "mongoose";
import { number, string } from "zod";

export interface User extends Document {
  
  username: string;
  age: number;
  email: string;
  password: string;
  isVerified: boolean,
  createdAt: Date;
}

const usersSchema: Schema<User> = new Schema<User>({
  username: {
    type: String,
    minlength: 3,
    maxlength: 25,
    required: true,
  },
  age: {
    type: Number,
    min: 5,
    max: 23,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
    validate: {
      validator: (value: string) => {
        // Simple email format validation
        return /\S+@\S+\.\S+/.test(value);
      },
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    min: 8,
    max: 25,
    required: true,
    select: false, // Hide the password field when querying a document.
  },
  isVerified: {
    type: Boolean,
    default: false
},
  // Automatically manage createdAt and updatedAt fields
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const userModel = mongoose.model<User>("users", usersSchema);
