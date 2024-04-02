import { nodeMailer } from "../utils/nodemailer";
export async function sendVerificationEmail(email: string, token: string) {
  const link = `https://www.youtube.com/watch?v=BrlR1Q8EzGI&pp=ygUeYmVyayBzZWF2IHBob3Yga2Vybmggc25lIGNob3Jk`;
  const mailOptions = {
    from: "seaporhai@gmail.com", // Replace with your sender email
    to: email,
    subject: "Verify Your Email Address",
    text: `Click on this link to verify your email: ${link} / ${token} `,
  };

  await nodeMailer.sendMail(mailOptions);
}
