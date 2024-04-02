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

export async function sendVerificationEmail(
  email: string,
  verificationLink: string
) {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Verify your email address",
    html: `Please click <a href="${verificationLink}">this shit </a> to verify your email address.`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}
