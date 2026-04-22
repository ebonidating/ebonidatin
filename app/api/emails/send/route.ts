import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail, type EmailType } from "@/lib/email/email-service"

export const dynamic = "force-dynamic"

interface SendEmailRequest {
  to: string
  type: EmailType
  data: Record<string, any>
  userId?: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: SendEmailRequest = await request.json()

    // Validate required fields
    if (!body.to || !body.type || !body.data) {
      return NextResponse.json(
        { error: "Missing required fields: to, type, data" },
        { status: 400 }
      )
    }

    // Check user email preferences
    const { data: preferences } = await supabase
      .from("email_preferences")
      .select("*")
      .eq("user_id", body.userId || user.id)
      .single()

    // Check if user has opted out of this email type
    if (preferences) {
      if (
        (body.type === "marketing" && !preferences.marketing_emails) ||
        (body.type === "weekly-digest" && !preferences.weekly_digest) ||
        (body.type === "new-match" && !preferences.match_notifications) ||
        (body.type === "new-message" && !preferences.message_notifications) ||
        (["subscription-confirmation", "subscription-renewal", "subscription-expiring"].includes(
          body.type
        ) &&
          !preferences.subscription_notifications) ||
        (["account-suspended", "verification"].includes(body.type) &&
          !preferences.account_notifications)
      ) {
        return NextResponse.json(
          { error: "User has opted out of this email type" },
          { status: 403 }
        )
      }
    }

    // Log the email
    const logResult = await supabase.rpc("log_email", {
      p_user_id: body.userId || user.id,
      p_email_type: body.type,
      p_recipient_email: body.to,
      p_subject: `Email: ${body.type}`,
      p_metadata: body.data,
    })

    // Send the email
    const success = await sendEmail({
      to: body.to,
      type: body.type,
      data: body.data,
    })

    if (!success) {
      // Update log status to failed
      if (logResult.data) {
        await supabase.rpc("update_email_status", {
          p_log_id: logResult.data,
          p_status: "failed",
          p_error_message: "Failed to send email via Resend",
        })
      }

      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }

    // Update log status to sent
    if (logResult.data) {
      await supabase.rpc("update_email_status", {
        p_log_id: logResult.data,
        p_status: "sent",
      })
    }

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${body.to}`,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
