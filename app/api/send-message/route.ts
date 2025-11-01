import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { receiver_id, message } = await request.json()

    if (!receiver_id || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        sender_id: user.id,
        receiver_id,
        message,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: data })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
