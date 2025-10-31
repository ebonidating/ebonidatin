// app/api/push/subscribe/route.ts
import { createRouteHandlerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subscription = await req.json()

  if (!subscription) {
    return NextResponse.json({ error: "Missing subscription object" }, { status: 400 })
  }

  const { data, error } = await supabase.from("push_subscriptions").insert([{ user_id: user.id, subscription }])

  if (error) {
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }

  return NextResponse.json({ message: "Subscription saved" }, { status: 201 })
}
