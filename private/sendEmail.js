const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: { name: 'TOH Scoring Portal', address: process.env.EMAIL_USERNAME },
      to: email,
      subject: subject,
      html: text,
    });

    console.log("Email sent successfully");
  } catch(error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;