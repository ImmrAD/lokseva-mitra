import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE || 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  verificationToken: string,
  userName: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: 'लोकसेवा मित्र - Email Verification | ईमेल सत्यापन',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #faf8f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border: 2px solid #2c1810; padding: 30px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #9f1239; text-align: center; margin: 0 0 10px 0; font-family: Georgia, serif;">
            लोकसेवा मित्र
          </h1>
          <div style="text-align: center; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #9f1239; margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 15px;">
            Voice of The Citizen Portal
          </div>

          <h2 style="font-size: 18px; color: #171717; margin-bottom: 15px;">Welcome, Citizen!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello <strong>${userName}</strong>,
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering with लोकसेवा मित्र. Please verify your email address to activate your account.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="display: inline-block; background-color: #2c1810; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase; border: none; font-size: 12px; letter-spacing: 1px;">
              Verify Email Address
            </a>
          </div>

          <p style="color: #999; font-size: 12px; line-height: 1.6; margin-bottom: 20px;">
            If the button does not work, use the token below on the verification page.
          </p>
          <p style="background-color: #f5f5f5; padding: 12px; color: #111; word-break: break-all; font-size: 13px; margin-bottom: 20px; border: 1px dashed #ccc;">
            <strong>Verification token:</strong><br />${verificationToken}
          </p>
          <p style="font-size: 12px; color: #0066cc; word-break: break-all; margin-bottom: 30px;">
            ${verificationUrl}
          </p>

          <p style="color: #999; font-size: 12px; line-height: 1.6; margin-bottom: 20px;">
            This verification link expires in 24 hours.
          </p>
          <p style="color: #999; font-size: 12px;">
            EDITORIAL DEPARTMENT | CITIZEN RELATIONS | LOKSEVA MITRA ©
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(email: string, userName: string) {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: 'लोकसेवा मित्र - Account Verified | आपका खाता सत्यापित हो गया',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #faf8f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border: 2px solid #2c1810; padding: 30px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #9f1239; text-align: center; margin: 0 0 10px 0; font-family: Georgia, serif;">
            लोकसेवा मित्र
          </h1>
          <div style="text-align: center; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #9f1239; margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 15px;">
            Voice of The Citizen Portal
          </div>

          <h2 style="font-size: 18px; color: #171717; margin-bottom: 15px;">Account Activated! 🎉</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Welcome to लोकसेवा मित्र, ${userName}!
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your account is now active. You can access all our services including scheme discovery, eligibility checking, and document guidance.
          </p>

          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            EDITORIAL DEPARTMENT | CITIZEN RELATIONS | LOKSEVA MITRA ©
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
