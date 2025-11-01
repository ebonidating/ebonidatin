import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Find verification record
    const { data: verification, error: verifyError } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("token", token)
      .single()

    if (verifyError || !verification) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    // Update user email verification
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ email_verified: true })
      .eq("id", verification.user_id)

    if (updateError) throw updateError

    // Mark verification as verified
    await supabase
      .from("email_verifications")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", verification.id)

    return NextResponse.json({ success: true, message: "Email verified successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
