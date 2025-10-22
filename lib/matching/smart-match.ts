import { createClient } from "@/lib/supabase/server"

interface MatchScore {
  userId: string
  score: number
  commonInterests: string[]
  compatibilityPercentage: number
}

export async function calculateSmartMatch(userId: string): Promise<MatchScore[]> {
  const supabase = await createClient()

  // Get user profile
  const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (!userProfile) return []

  // Get all potential matches
  const { data: potentialMatches } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", userId)
    .eq("gender_preference", userProfile.gender || "any")
    .not("id", "in", `(${await getBlockedUsers(userId)})`)

  if (!potentialMatches) return []

  // Calculate compatibility scores
  const matches: MatchScore[] = potentialMatches.map((profile) => {
    let score = 0
    const commonInterests: string[] = []

    // Age compatibility (±5 years = 20 points)
    const ageDiff = Math.abs((userProfile.age || 0) - (profile.age || 0))
    if (ageDiff <= 5) score += 20
    else if (ageDiff <= 10) score += 10

    // Location proximity (same city = 15 points)
    if (userProfile.city === profile.city) score += 15
    else if (userProfile.country === profile.country) score += 5

    // Shared interests
    const userInterests = userProfile.interests || []
    const profileInterests = profile.interests || []
    const shared = userInterests.filter((i) => profileInterests.includes(i))
    score += shared.length * 10
    commonInterests.push(...shared)

    // Subscription tier match (premium users get priority)
    if (userProfile.subscription_tier === profile.subscription_tier) score += 5

    // Verified badge bonus
    if (profile.verified) score += 10

    const compatibilityPercentage = Math.min(100, Math.round((score / 100) * 100))

    return {
      userId: profile.id,
      score,
      commonInterests,
      compatibilityPercentage,
    }
  })

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score)
}

async function getBlockedUsers(userId: string): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase.from("blocks").select("blocked_user_id").eq("user_id", userId)
  return data?.map((b) => `'${b.blocked_user_id}'`).join(",") || "''"
}
