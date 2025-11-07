export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import webPush from "web-push"

webPush.setVapidDetails(
  "mailto:info@ebonidating.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: Request) {
  try {
    const { subscription, message } = await req.json()

    await webPush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Ebonidating",
        body: message,
      })
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Push server error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
