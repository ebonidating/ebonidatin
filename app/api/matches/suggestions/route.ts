import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getMatchSuggestions } from "@/lib/matching/advanced-matching"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const minCompatibility = parseInt(searchParams.get("minCompatibility") || "70")

    // Get match suggestions
    const matches = await getMatchSuggestions(user.id, limit, minCompatibility)

    return NextResponse.json({
      success: true,
      count: matches.length,
      matches,
    })
  } catch (error) {
    console.error("Error fetching match suggestions:", error)
    return NextResponse.json(
      { error: "Failed to fetch match suggestions" },
      { status: 500 }
    )
  }
}
