import nodemailer from "nodemailer";

export const nodeMailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "seaporhai@gmail.com",
    pass: "wpgdcptkizulhyvj",
  },
});
