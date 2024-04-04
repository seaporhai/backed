// import { nodeMailer } from "../utils/nodemailer";
// export async function sendVerificationEmail(email: string, token: string) {
//   const mailOptions = {
//     from: "seaporhai@gmail.com", // Replace with your sender email
//     to: email,
//     subject: "Verify Your Email Address",
//     // html: `Click on this link to verify your email:  / ${token} `,
//     html: `Please click <a href="${sendVerificationEmail}">here</a> to verify your email address.`,
//   };

//   await nodeMailer.sendMail(mailOptions);
// }
require("dotenv").config();
import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string , token: String) {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER as string,
      pass: process.env.PASSWORD as string,
    },
  });
  // await sendVerificationEmail(newUser.email, verifyEmailLink);
  // Email content
  const mailOptions = {
    from: process.env.USER as string,
    to: email,
    subject: "Verify your email address",
    text: `http://localhost:3001/users/verify?token=${token}`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}
