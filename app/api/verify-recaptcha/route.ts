import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

interface RecaptchaResponse {
  success: boolean
  score: number
  action: string
  challenge_ts: string
  hostname: string
  "error-codes"?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { token, action } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      )
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error("reCAPTCHA secret key not configured")
      return NextResponse.json(
        { success: true, score: 1 }, // Bypass if not configured
        { status: 200 }
      )
    }

    // Verify token with Google reCAPTCHA Enterprise
    const verifyUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/assessments?key=${secretKey}`

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: {
          token,
          expectedAction: action,
          siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        },
      }),
    })

    const data = await response.json()

    // Check if verification was successful
    if (!data.tokenProperties?.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
          details: data.tokenProperties?.invalidReason,
        },
        { status: 400 }
      )
    }

    // Check score (0.0 - 1.0, where 1.0 is very likely a human)
    const score = data.riskAnalysis?.score || 0

    // Allow if score is above threshold (0.5 is recommended)
    const threshold = 0.5
    const success = score >= threshold

    return NextResponse.json({
      success,
      score,
      action: data.tokenProperties?.action,
    })
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    )
  }
}
