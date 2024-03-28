import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  username: string;
  age: number;
  email: string;
  password: number;
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
    type: Number,
    required: true,
    select: false, // Hide the password field when querying a document.
  },
// Automatically manage createdAt and updatedAt fields
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const userModel = mongoose.model<User>("users", usersSchema);
