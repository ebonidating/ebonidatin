/**
 * Email Service
 * Handles all transactional emails for the platform
 */

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const SENDER_EMAIL = process.env.NEXT_PUBLIC_SENDER_EMAIL || "noreply@ebonidating.com"
const BRAND_NAME = "Eboni Dating"

export type EmailType =
  | "welcome"
  | "verification"
  | "password-reset"
  | "new-match"
  | "new-message"
  | "subscription-confirmation"
  | "subscription-renewal"
  | "subscription-expiring"
  | "profile-verified"
  | "account-suspended"
  | "weekly-digest"
  | "match-reminder"

export interface EmailPayload {
  to: string
  type: EmailType
  data: Record<string, any>
}

/**
 * Send email through Resend
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    const template = getEmailTemplate(payload.type, payload.data)

    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: payload.to,
      subject: template.subject,
      html: template.html,
      react: template.react ? template.react : undefined,
    })

    console.log(`[Email] Sent ${payload.type} to ${payload.to}:`, result.id)
    return !!result.id
  } catch (error) {
    console.error(`[Email] Error sending ${payload.type} to ${payload.to}:`, error)
    return false
  }
}

/**
 * Send bulk emails (e.g., for digests)
 */
export async function sendBulkEmails(
  recipients: string[],
  type: EmailType,
  data: Record<string, any>
): Promise<number> {
  let successCount = 0

  for (const recipient of recipients) {
    const success = await sendEmail({
      to: recipient,
      type,
      data,
    })
    if (success) successCount++
  }

  return successCount
}

/**
 * Get email template by type
 */
function getEmailTemplate(type: EmailType, data: Record<string, any>) {
  switch (type) {
    case "welcome":
      return getWelcomeTemplate(data)
    case "verification":
      return getVerificationTemplate(data)
    case "password-reset":
      return getPasswordResetTemplate(data)
    case "new-match":
      return getNewMatchTemplate(data)
    case "new-message":
      return getNewMessageTemplate(data)
    case "subscription-confirmation":
      return getSubscriptionConfirmationTemplate(data)
    case "subscription-renewal":
      return getSubscriptionRenewalTemplate(data)
    case "subscription-expiring":
      return getSubscriptionExpiringTemplate(data)
    case "profile-verified":
      return getProfileVerifiedTemplate(data)
    case "weekly-digest":
      return getWeeklyDigestTemplate(data)
    case "match-reminder":
      return getMatchReminderTemplate(data)
    default:
      throw new Error(`Unknown email type: ${type}`)
  }
}

// ===== Email Templates =====

function getWelcomeTemplate(data: {
  name: string
  verificationUrl: string
}) {
  return {
    subject: `Welcome to ${BRAND_NAME}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${BRAND_NAME}!</h1>
              <p>Let's find your perfect match</p>
            </div>
            <div class="content">
              <p>Hi ${data.name},</p>
              <p>Thank you for joining ${BRAND_NAME}! We're excited to help you find meaningful connections within the Black community.</p>
              <p>To get started, please verify your email address:</p>
              <center>
                <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
              </center>
              <p>Once verified, you can complete your profile and start connecting with other members.</p>
              <p>Happy matching!<br>${BRAND_NAME} Team</p>
            </div>
            <div class="footer">
              <p>© 2026 ${BRAND_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

function getVerificationTemplate(data: { name: string; verificationCode: string }) {
  return {
    subject: `Verify your ${BRAND_NAME} email`,
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Verify Your Email</h2>
            <p>Hi ${data.name},</p>
            <p>Your verification code is:</p>
            <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
              ${data.verificationCode}
            </div>
            <p>This code expires in 24 hours.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  }
}

function getPasswordResetTemplate(data: { name: string; resetUrl: string }) {
  return {
    subject: "Reset your password",
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>Hi ${data.name},</p>
            <p>We received a request to reset your password. Click the link below to create a new password:</p>
            <p><a href="${data.resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
            <p>This link expires in 24 hours.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  }
}

function getNewMatchTemplate(data: {
  name: string
  matchName: string
  matchPhotoUrl?: string
  profileUrl: string
}) {
  return {
    subject: `${data.matchName} might be your perfect match!`,
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>You Got a Match!</h2>
            <p>Hi ${data.name},</p>
            <p><strong>${data.matchName}</strong> is interested in getting to know you!</p>
            <p><a href="${data.profileUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">View Profile</a></p>
            <p>Don't miss out on this connection!</p>
          </div>
        </body>
      </html>
    `,
  }
}

function getNewMessageTemplate(data: {
  name: string
  senderName: string
  message: string
  chatUrl: string
}) {
  return {
    subject: `New message from ${data.senderName}`,
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>New Message</h2>
            <p>Hi ${data.name},</p>
            <p><strong>${data.senderName}</strong> sent you a message:</p>
            <div style="background: #f0f0f0; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p>"${data.message}"</p>
            </div>
            <p><a href="${data.chatUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">Reply Now</a></p>
          </div>
        </body>
      </html>
    `,
  }
}

function getSubscriptionConfirmationTemplate(data: {
  name: string
  tier: string
  amount: number
  renewalDate: string
}) {
  return {
    subject: `Welcome to ${data.tier} - Subscription Confirmed`,
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Subscription Confirmed</h2>
            <p>Hi ${data.name},</p>
            <p>Your subscription to <strong>${data.tier}</strong> is now active!</p>
            <div style="background: #f0f0f0; padding: 15px; margin: 20px 0;">
              <p><strong>Plan:</strong> ${data.tier}</p>
              <p><strong>Amount:</strong> $${data.amount.toFixed(2)}</p>
              <p><strong>Next Renewal:</strong> ${data.renewalDate}</p>
            </div>
            <p>Enjoy exclusive features and premium connections!</p>
          </div>
        </body>
      </html>
    `,
  }
}

function getSubscriptionRenewalTemplate(data: {
  name: string
  tier: string
  amount: number
}) {
  return {
    subject: "Your subscription has been renewed",
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Subscription Renewed</h2>
            <p>Hi ${data.name},</p>
            <p>Your ${data.tier} subscription has been successfully renewed!</p>
            <p>Amount charged: $${data.amount.toFixed(2)}</p>
            <p>Continue enjoying exclusive features and premium matching!</p>
          </div>
        </body>
      </html>
    `,
  }
}

function getSubscriptionExpiringTemplate(data: {
  name: string
  tier: string
  expirationDate: string
}) {
  return {
    subject: "Your subscription is expiring soon",
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Subscription Expiring Soon</h2>
            <p>Hi ${data.name},</p>
            <p>Your ${data.tier} subscription will expire on <strong>${data.expirationDate}</strong>.</p>
            <p>Renew now to keep enjoying premium features!</p>
          </div>
        </body>
      </html>
    `,
  }
}

function getProfileVerifiedTemplate(data: { name: string }) {
  return {
    subject: "Your profile has been verified!",
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Profile Verified</h2>
            <p>Hi ${data.name},</p>
            <p>Congratulations! Your profile has been verified.</p>
            <p>You now have a verified badge on your profile, which increases trust and engagement with other members.</p>
          </div>
        </body>
      </html>
    `,
  }
}

function getWeeklyDigestTemplate(data: {
  name: string
  newMatches: number
  unreadMessages: number
  digestUrl: string
}) {
  return {
    subject: `Your weekly ${BRAND_NAME} digest`,
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Your Weekly Digest</h2>
            <p>Hi ${data.name},</p>
            <div style="background: #f0f0f0; padding: 15px; margin: 20px 0;">
              <p>This week:</p>
              <ul>
                <li><strong>${data.newMatches}</strong> new matches</li>
                <li><strong>${data.unreadMessages}</strong> unread messages</li>
              </ul>
            </div>
            <p><a href="${data.digestUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">View Full Digest</a></p>
          </div>
        </body>
      </html>
    `,
  }
}

function getMatchReminderTemplate(data: {
  name: string
  pendingMatches: number
  remindUrl: string
}) {
  return {
    subject: `${data.pendingMatches} people are waiting to hear from you!`,
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Don't Miss Out!</h2>
            <p>Hi ${data.name},</p>
            <p><strong>${data.pendingMatches}</strong> people are waiting for your response!</p>
            <p><a href="${data.remindUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">Respond Now</a></p>
          </div>
        </body>
      </html>
    `,
  }
}
