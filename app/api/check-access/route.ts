import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
import { createClient } from "@/lib/supabase/server"
import { TIER_FEATURES } from "@/lib/subscription/tier-features"

export async function POST(request: NextRequest) {
  try {
    const { feature } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ hasAccess: false }, { status: 401 })
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_type, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    const tier = subscription?.plan_type || "free"
    const tierFeatures = TIER_FEATURES[tier as keyof typeof TIER_FEATURES]
    const hasAccess = tierFeatures?.features[feature] ?? false

    return NextResponse.json({ hasAccess })
  } catch (error) {
    return NextResponse.json({ hasAccess: false }, { status: 500 })
  }
}
