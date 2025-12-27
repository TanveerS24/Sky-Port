import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Ensure environment variables are loaded
dotenv.config();

// Create transporter with credentials from environment variables
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASS in environment variables');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

let transporter;

try {
  transporter = createTransporter();
} catch (error) {
  console.error('❌ Failed to initialize email transporter:', error.message);
}

/**
 * Sends OTP email and logs info
 * @param {string} to - receiver email
 * @param {string} otp - one time password
 */
export default async function sendOTPEmail(to, otp) {
  if (!transporter) {
    throw new Error('Email transporter not initialized. Check EMAIL_USER and EMAIL_PASS environment variables.');
  }
  const mailOptions = {
    from: `"SkyPort Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your SkyPort Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px;">
        <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #111827;">Verify Your Email</h2>

          <p style="color: #374151; font-size: 15px;">
            Hello 👋,
          </p>

          <p style="color: #374151; font-size: 15px;">
            Use the following One-Time Password (OTP) to complete your verification.
          </p>

          <div style="
            margin: 24px 0;
            padding: 16px;
            background: #f3f4f6;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 6px;
            color: #111827;
            border-radius: 6px;
          ">
            ${otp}
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            This OTP is valid for <strong>5 minutes</strong>.  
            Do not share it with anyone.
          </p>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="color: #9ca3af; font-size: 12px;">
            If you didn’t request this, you can safely ignore this email.
          </p>

          <p style="color: #9ca3af; font-size: 12px;">
            — SkyPort Security Team
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log('📧 OTP email sent');
    console.log('➡️ To:', to);
    console.log('🆔 Message ID:', info.messageId);

    return true;
  } catch (error) {
    console.error('❌ Failed to send OTP email');
    console.error('➡️ To:', to);
    console.error(error);

    throw error;
  }
};
