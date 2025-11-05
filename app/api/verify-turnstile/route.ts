import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 400 })
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY

    if (!secretKey) {
      console.error("Missing TURNSTILE_SECRET_KEY")
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 })
    }

    // Verify token with Cloudflare Turnstile
    const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    })

    const verifyData = await verifyResponse.json()

    if (verifyData.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: "Verification failed", details: verifyData["error-codes"] },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Turnstile verification error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
