import { string, z } from "zod";

export const UseSchema = z.object({
  username: z
    .string()
    .min(3, "must be more than3")
    .max(25, "please be lower than 25 character"),
  age: z
    .number()
    .min(0, "Age can't be negative")
    .max(30, "please be lower than  or equal to 30 years old"),
  email: z.string().email("Email is already used").min(1).max(45),
  password :z.string().min(8 , "Invalid password is too short")
});
