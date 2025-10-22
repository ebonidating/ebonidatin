import { createClient } from "@/lib/supabase/server"
import type { SubscriptionTier } from "./tier-features"

export async function getUserSubscriptionTier(): Promise<SubscriptionTier | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_type, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (!subscription) return null
    return subscription.plan_type as SubscriptionTier
  } catch (error) {
    return null
  }
}

export async function checkFeatureAccess(feature: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_type, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    const tier = (subscription?.plan_type as SubscriptionTier) || "free"

    // Import here to avoid circular dependency
    const { hasFeature } = await import("./tier-features")
    return hasFeature(tier, feature)
  } catch (error) {
    return false
  }
}

export async function enforceFeatureAccess(feature: string): Promise<void> {
  const hasAccess = await checkFeatureAccess(feature)
  if (!hasAccess) {
    throw new Error(`Feature "${feature}" requires a paid subscription`)
  }
}
