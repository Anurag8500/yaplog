import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendVerificationEmail({
  email,
  name,
  token,
}: {
  email: string
  name: string
  token: string
}) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email for YAPLOG",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #171717;">Welcome to YAPLOG, ${name}!</h2>
          <p style="color: #404040; font-size: 16px; line-height: 24px;">
            Please verify your email address to secure your account and start using YAPLOG.
          </p>
          
          <div style="margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Verify Email
            </a>
          </div>

          <p style="color: #404040; font-size: 14px; margin-bottom: 8px;">
            Or copy and paste this link into your browser:
          </p>
          <a href="${verifyUrl}" style="color: #171717; text-decoration: underline; word-break: break-all; font-size: 14px;">
            ${verifyUrl}
          </a>

          <p style="margin-top: 32px; font-size: 12px; color: #737373;">
            This link will expire in 24 hours. If you didn't sign up for YAPLOG, you can safely ignore this email.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Error sending verification email:", error)
    // Don't throw to prevent leaking error details to client, just log it
    // The calling function will handle the success/failure state
  }
}

export async function sendPasswordResetEmail({
  email,
  token,
}: {
  email: string
  token: string
}) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Reset your YAPLOG password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #171717;">Reset your password</h2>
          <p style="color: #404040; font-size: 16px; line-height: 24px;">
            We received a request to reset your password for your YAPLOG account.
          </p>
          
          <div style="margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>

          <p style="color: #404040; font-size: 14px; margin-bottom: 8px;">
            Or copy and paste this link into your browser:
          </p>
          <a href="${resetUrl}" style="color: #171717; text-decoration: underline; word-break: break-all; font-size: 14px;">
            ${resetUrl}
          </a>

          <p style="margin-top: 32px; font-size: 12px; color: #737373;">
            This link will expire in 15 minutes. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Error sending password reset email:", error)
  }
}
