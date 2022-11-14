const nodemailer = require('nodemailer');
const { logger } = require('../controllers/logger');

/**
 *
 * Sends an email to the specified recipient.
 *
 * @param {string} email Email address to send to
 * @param {string} subject Subject of email
 * @param {string} text Body of email
 */
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
      bcc: 'scoringportal@tourofhonor.com',
      subject,
      html: text,
    });
    logger.info('Email sent successfully', { calledFrom: 'sendEmail.js' });
  } catch (error) {
    logger.error(error, 'email not sent');
  }
};

module.exports = sendEmail;
