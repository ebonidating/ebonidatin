import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user dashboard stats
    const { data: stats, error: statsError } = await supabase
      .rpc("get_user_dashboard_stats", { user_uuid: user.id })

    if (statsError) {
      throw statsError
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error: any) {
    console.error("User stats error:", error)
    return NextResponse.json({ 
      error: "Failed to get user stats",
      message: error.message 
    }, { status: 500 })
  }
}
