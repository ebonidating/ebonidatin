export const runtime = "edge"
export const dynamic = "force-dynamic"

import { NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log("Received push data:", data)

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ebonidating.com"
    await fetch(`${baseUrl}/api/push/server`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Edge push error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
