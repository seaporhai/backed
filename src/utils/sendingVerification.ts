import { nodeMailer } from "../utils/nodemailer";
export async function sendVerificationEmail(email: string, token: string) {
  const link = `https://www.youtube.com/watch?v=SUxcmZuTtDQ&list=RDSUxcmZuTtDQ&start_radio=1 `;
  const mailOptions = {
    from: "seaporhai@gmail.com", // Replace with your sender email
    to: email,
    subject: "Verify Your Email Address",
    text: `Click on this link to verify your email: ${link} / ${token}}`,
  };

  await nodeMailer.sendMail(mailOptions);
}
