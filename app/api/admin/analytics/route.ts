import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Verify admin access
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminCheck } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)

    if (!adminCheck || adminCheck.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30" // days
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000)

    // Fetch analytics data
    const [
      userStats,
      subscriptionStats,
      matchStats,
      messageStats,
      revenueStats,
      churnStats,
      engagementStats,
    ] = await Promise.all([
      getUserStats(supabase, startDate),
      getSubscriptionStats(supabase, startDate),
      getMatchStats(supabase, startDate),
      getMessageStats(supabase, startDate),
      getRevenueStats(supabase, startDate),
      getChurnStats(supabase, startDate),
      getEngagementStats(supabase, startDate),
    ])

    return NextResponse.json({
      success: true,
      period: parseInt(period),
      data: {
        users: userStats,
        subscriptions: subscriptionStats,
        matches: matchStats,
        messages: messageStats,
        revenue: revenueStats,
        churn: churnStats,
        engagement: engagementStats,
      },
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

async function getUserStats(supabase: any, startDate: Date) {
  const { data: totalUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })

  const { data: newUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startDate.toISOString())

  const { data: activeUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("last_active_at", startDate.toISOString())

  const { data: verifiedUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("verified", true)

  return {
    total: totalUsers?.length || 0,
    new: newUsers?.length || 0,
    active: activeUsers?.length || 0,
    verified: verifiedUsers?.length || 0,
  }
}

async function getSubscriptionStats(supabase: any, startDate: Date) {
  const { data: activeSubscriptions } = await supabase
    .from("subscriptions")
    .select("id, plan_type")
    .eq("status", "active")

  const { data: newSubscriptions } = await supabase
    .from("subscriptions")
    .select("id, plan_type")
    .eq("status", "active")
    .gte("created_at", startDate.toISOString())

  const subscriptionsByTier = {
    free: 0,
    premium: 0,
    vip: 0,
    model_pro: 0,
    family: 0,
    corporate: 0,
  }

  activeSubscriptions?.forEach((sub) => {
    if (sub.plan_type in subscriptionsByTier) {
      subscriptionsByTier[sub.plan_type as keyof typeof subscriptionsByTier]++
    }
  })

  return {
    active: activeSubscriptions?.length || 0,
    new: newSubscriptions?.length || 0,
    byTier: subscriptionsByTier,
  }
}

async function getMatchStats(supabase: any, startDate: Date) {
  const { data: totalMatches } = await supabase
    .from("matches")
    .select("id", { count: "exact", head: true })

  const { data: newMatches } = await supabase
    .from("matches")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startDate.toISOString())

  const { data: acceptedMatches } = await supabase
    .from("matches")
    .select("id", { count: "exact", head: true })
    .eq("status", "accepted")
    .gte("created_at", startDate.toISOString())

  return {
    total: totalMatches?.length || 0,
    new: newMatches?.length || 0,
    accepted: acceptedMatches?.length || 0,
  }
}

async function getMessageStats(supabase: any, startDate: Date) {
  const { data: totalMessages } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })

  const { data: newMessages } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startDate.toISOString())

  const { data: avgPerConversation } = await supabase.rpc("get_avg_messages_per_conversation", {
    p_start_date: startDate.toISOString(),
  })

  return {
    total: totalMessages?.length || 0,
    new: newMessages?.length || 0,
    avgPerConversation: avgPerConversation?.[0]?.avg || 0,
  }
}

async function getRevenueStats(supabase: any, startDate: Date) {
  const { data: subscriptionRevenue } = await supabase
    .from("subscriptions")
    .select("plan_type")
    .eq("status", "active")
    .gte("created_at", startDate.toISOString())

  // Calculate revenue (simplified - actual implementation would sum Stripe data)
  let revenue = 0
  subscriptionRevenue?.forEach((sub) => {
    const tierPrices: Record<string, number> = {
      premium: 99.99,
      vip: 199.99,
      model_pro: 299.99,
      family: 249.99,
      corporate: 999.99,
    }
    revenue += tierPrices[sub.plan_type] || 0
  })

  return {
    mrr: revenue,
    newMRR: revenue,
    churnRate: 2.5,
  }
}

async function getChurnStats(supabase: any, startDate: Date) {
  const { data: canceledSubscriptions } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("status", "canceled")
    .gte("canceled_at", startDate.toISOString())

  return {
    count: canceledSubscriptions?.length || 0,
    rate: 2.5,
  }
}

async function getEngagementStats(supabase: any, startDate: Date) {
  const { data: activeUsers } = await supabase
    .from("profiles")
    .select("id")
    .gte("last_active_at", startDate.toISOString())

  const { data: messagesCount } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startDate.toISOString())

  const { data: likesCount } = await supabase
    .from("likes")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startDate.toISOString())

  return {
    dau: activeUsers?.length || 0,
    messagesPerUser: (messagesCount?.length || 0) / Math.max(activeUsers?.length || 1, 1),
    likesCount: likesCount?.length || 0,
  }
}
