export function getVerificationEmailTemplate(userName: string, verificationLink: string) {
  return {
    subject: "Verify Your Eboni Dating Account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - Eboni Dating</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fef3c7;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                   Header 
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                        ❤️ Eboni Dating
                      </h1>
                      <p style="margin: 10px 0 0; color: #fef3c7; font-size: 14px;">
                        Connecting the Black Diaspora Worldwide
                      </p>
                    </td>
                  </tr>
                  
                   Content 
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">
                        Welcome to Eboni Dating, ${userName}!
                      </h2>
                      
                      <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Thank you for joining our community of Black singles finding meaningful connections worldwide. We're excited to have you!
                      </p>
                      
                      <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        To get started and access all features, please verify your email address by clicking the button below:
                      </p>
                      
                       CTA Button 
                      <table role="presentation" style="margin: 0 auto;">
                        <tr>
                          <td style="border-radius: 6px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                            <a href="${verificationLink}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        Or copy and paste this link into your browser:
                      </p>
                      
                      <p style="margin: 0 0 30px; padding: 12px; background-color: #f3f4f6; border-radius: 4px; color: #4b5563; font-size: 12px; word-break: break-all; font-family: monospace;">
                        ${verificationLink}
                      </p>
                      
                      <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                          <strong>Security Note:</strong> This link will expire in 24 hours. If you didn't create an account with Eboni Dating, please ignore this email.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                   Footer 
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                        Need help? Contact us at <a href="mailto:support@ebonidating.com" style="color: #f59e0b; text-decoration: none;">support@ebonidating.com</a>
                      </p>
                      
                      <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">
                        © 2025 Eboni Dating. All rights reserved.<br>
                        Celebrating Black love and connections worldwide.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Welcome to Eboni Dating, ${userName}!

Thank you for joining our community of Black singles finding meaningful connections worldwide.

To verify your email address and access all features, please click the link below:

${verificationLink}

This link will expire in 24 hours. If you didn't create an account with Eboni Dating, please ignore this email.

Need help? Contact us at support@ebonidating.com

© 2025 Eboni Dating - Celebrating Black love and connections worldwide.
    `,
  }
}
