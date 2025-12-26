import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.API_BASE_URL}/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: `"Secure Kit" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Verify your email address",
    text: `
Verify your Secure Kit account.

Open this link to verify your email:
${verifyUrl}

This link expires in 24 hours.
If you did not create this account, you can safely ignore this email.
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #111;">Verify your email address</h2>

        <p>Thanks for creating a <strong>Secure Kit</strong> account.</p>

        <p>Please confirm your email address by clicking the button below:</p>

        <p style="margin: 24px 0;">
          <a
            href="${verifyUrl}"
            style="
              background-color: #2563eb;
              color: #ffffff;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
              font-weight: bold;
            "
          >
            Verify Email
          </a>
        </p>

        <p>This link will expire in <strong>24 hours</strong>.</p>

        <p style="font-size: 14px; color: #666;">
          If you didn’t create this account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
