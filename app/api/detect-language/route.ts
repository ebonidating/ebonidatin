import { NextResponse } from "next/server"
import { detectUserLanguage } from "@/lib/i18n/detect-language"

export async function GET() {
  try {
    const language = await detectUserLanguage()
    return NextResponse.json({ language })
  } catch (error) {
    console.error("[v0] Error in detect-language API:", error)
    return NextResponse.json({ language: "en" })
  }
}
