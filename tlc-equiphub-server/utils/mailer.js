const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`(Skipped) Would send to ${to}: ${subject}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: `"TLC EquipAdmin" <${process.env.EMAIL_USER}>`,
      to, subject, html
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Email error:`, err.message);
  }
};

module.exports = { sendEmail };