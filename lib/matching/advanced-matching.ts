/**
 * Advanced Matching Algorithm
 * Implements multi-factor compatibility scoring including:
 * - Personality compatibility (Myers-Briggs, Love Languages)
 * - Lifestyle & value alignment
 * - Relationship goal matching
 * - Geographic & temporal compatibility
 * - Engagement prediction
 */

import { createClient } from "@/lib/supabase/server"

export enum RelationshipGoal {
  CASUAL = "casual",
  DATING = "dating",
  SERIOUS = "serious",
  MARRIAGE = "marriage",
  OPEN = "open",
}

export enum LoveLanguage {
  WORDS_OF_AFFIRMATION = "words_of_affirmation",
  ACTS_OF_SERVICE = "acts_of_service",
  RECEIVING_GIFTS = "receiving_gifts",
  QUALITY_TIME = "quality_time",
  PHYSICAL_TOUCH = "physical_touch",
}

export interface PersonalityProfile {
  type?: string // Myers-Briggs type (e.g., ENFP)
  loveLanguages?: LoveLanguage[]
  values?: string[] // e.g., family, career, spirituality
  communicationStyle?: string
  conflictResolutionStyle?: string
}

export interface LifestyleProfile {
  smokingStatus?: string
  drinkingStatus?: string
  exerciseFrequency?: string
  dietaryPreferences?: string
  wantChildren?: boolean
  wantPets?: boolean
  workLife?: string
  financialOutlook?: string
}

export interface AdvancedMatchScore {
  userId: string
  totalScore: number // 0-1000
  compatibilityPercentage: number // 0-100
  breakdown: {
    personalityMatch: number
    lifestyleMatch: number
    goalAlignment: number
    geographicProximity: number
    engagementPotential: number
    profileQuality: number
  }
  commonInterests: string[]
  matchReasons: string[]
  redFlags?: string[]
  engagementPrediction: "high" | "medium" | "low"
}

/**
 * Calculate comprehensive matching score between two users
 */
export async function calculateAdvancedMatch(userId: string, targetUserId: string): Promise<AdvancedMatchScore | null> {
  const supabase = await createClient()

  // Get both user profiles
  const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", userId).single()
  const { data: targetProfile } = await supabase.from("profiles").select("*").eq("id", targetUserId).single()

  if (!userProfile || !targetProfile) return null

  // Check for blocks
  const { data: isBlocked } = await supabase
    .from("blocks")
    .select("id")
    .or(`and(user_id.eq.${userId},blocked_user_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},blocked_user_id.eq.${userId})`)
    .limit(1)

  if (isBlocked && isBlocked.length > 0) return null

  // Initialize score breakdown
  const breakdown = {
    personalityMatch: 0,
    lifestyleMatch: 0,
    goalAlignment: 0,
    geographicProximity: 0,
    engagementPotential: 0,
    profileQuality: 0,
  }

  const matchReasons: string[] = []
  const redFlags: string[] = []

  // 1. Personality Match (max 150 points)
  breakdown.personalityMatch = calculatePersonalityMatch(userProfile, targetProfile, matchReasons)

  // 2. Lifestyle Compatibility (max 150 points)
  breakdown.lifestyleMatch = calculateLifestyleMatch(userProfile, targetProfile, matchReasons, redFlags)

  // 3. Relationship Goal Alignment (max 200 points)
  breakdown.goalAlignment = calculateGoalAlignment(userProfile, targetProfile, matchReasons, redFlags)

  // 4. Geographic Proximity (max 150 points)
  breakdown.geographicProximity = calculateGeographicScore(userProfile, targetProfile)

  // 5. Engagement Potential (max 150 points)
  breakdown.engagementPotential = calculateEngagementPotential(userProfile, targetProfile, matchReasons)

  // 6. Profile Quality (max 200 points)
  breakdown.profileQuality = calculateProfileQuality(userProfile, targetProfile)

  // Calculate total score and percentage
  const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0)
  const compatibilityPercentage = Math.min(100, Math.round((totalScore / 1000) * 100))

  // Common interests
  const commonInterests = getCommonInterests(userProfile.interests || [], targetProfile.interests || [])

  // Engagement prediction based on mutual profile strength
  const engagementPrediction = predictEngagement(
    compatibilityPercentage,
    userProfile,
    targetProfile,
    commonInterests
  )

  return {
    userId: targetUserId,
    totalScore,
    compatibilityPercentage,
    breakdown,
    commonInterests,
    matchReasons: matchReasons.slice(0, 5), // Top 5 reasons
    redFlags: redFlags.length > 0 ? redFlags.slice(0, 3) : undefined,
    engagementPrediction,
  }
}

/**
 * Get top matching suggestions for a user
 */
export async function getMatchSuggestions(
  userId: string,
  limit: number = 10,
  minCompatibility: number = 70
): Promise<AdvancedMatchScore[]> {
  const supabase = await createClient()

  // Get user profile for filtering
  const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", userId).single()
  if (!userProfile) return []

  // Get blocked users
  const { data: blockedUsers } = await supabase
    .from("blocks")
    .select("blocked_user_id")
    .eq("user_id", userId)

  const blockedIds = blockedUsers?.map((b) => b.blocked_user_id) || []

  // Get potential matches based on basic filters
  const { data: potentialMatches } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", userId)
    .eq("gender_preference", userProfile.gender || "any")
    .not("id", "in", `(${[userId, ...blockedIds].map((id) => `'${id}'`).join(",")})`)
    .limit(limit * 3) // Get more candidates for filtering

  if (!potentialMatches || potentialMatches.length === 0) return []

  // Calculate advanced matches
  const matches: AdvancedMatchScore[] = []

  for (const profile of potentialMatches) {
    const match = await calculateAdvancedMatch(userId, profile.id)
    if (match && match.compatibilityPercentage >= minCompatibility) {
      matches.push(match)
    }
    if (matches.length >= limit) break
  }

  // Sort by compatibility percentage descending
  return matches.sort((a, b) => b.compatibilityPercentage - a.compatibilityPercentage)
}

// ===== Helper Functions =====

function calculatePersonalityMatch(
  user: any,
  target: any,
  matchReasons: string[]
): number {
  let score = 0

  // Myers-Briggs compatibility (simplified)
  if (user.personality_type && target.personality_type) {
    const compatibility = assessPersonalityCompatibility(user.personality_type, target.personality_type)
    score += compatibility * 100
    if (compatibility > 0.7) {
      matchReasons.push(`Compatible personality types (${user.personality_type} & ${target.personality_type})`)
    }
  }

  // Love language match
  if (user.love_languages && target.love_languages) {
    const intersection = user.love_languages.filter((l: string) => target.love_languages.includes(l))
    score += Math.min(50, intersection.length * 25)
  }

  // Shared values
  if (user.values && target.values) {
    const sharedValues = user.values.filter((v: string) => target.values.includes(v))
    score += Math.min(50, sharedValues.length * 15)
    if (sharedValues.length > 0) {
      matchReasons.push(`Shared values: ${sharedValues.slice(0, 2).join(", ")}`)
    }
  }

  return Math.min(150, score)
}

function calculateLifestyleMatch(
  user: any,
  target: any,
  matchReasons: string[],
  redFlags: string[]
): number {
  let score = 0

  // Smoking compatibility
  if (user.smoking_status && target.smoking_status) {
    if (user.smoking_status === target.smoking_status) {
      score += 30
    } else if (
      (user.smoking_status === "never" && target.smoking_status === "quit") ||
      (user.smoking_status === "quit" && target.smoking_status === "never")
    ) {
      score += 20
    } else {
      redFlags.push("Different smoking preferences")
    }
  }

  // Drinking compatibility
  if (user.drinking_status && target.drinking_status) {
    if (user.drinking_status === target.drinking_status) {
      score += 25
    } else if (Math.abs(["abstain", "occasionally", "regularly", "frequently"].indexOf(user.drinking_status) - 
              ["abstain", "occasionally", "regularly", "frequently"].indexOf(target.drinking_status)) <= 1) {
      score += 15
    }
  }

  // Exercise frequency
  if (user.exercise_frequency && target.exercise_frequency) {
    if (user.exercise_frequency === target.exercise_frequency) {
      score += 20
      matchReasons.push("Share same exercise habits")
    }
  }

  // Financial outlook
  if (user.financial_outlook && target.financial_outlook) {
    if (user.financial_outlook === target.financial_outlook) {
      score += 25
    }
  }

  // Children preferences
  if (user.wants_children !== undefined && target.wants_children !== undefined) {
    if (user.wants_children === target.wants_children) {
      score += 35
    } else {
      redFlags.push("Different views on having children")
    }
  }

  return Math.min(150, score)
}

function calculateGoalAlignment(
  user: any,
  target: any,
  matchReasons: string[],
  redFlags: string[]
): number {
  let score = 0

  if (!user.relationship_goal || !target.relationship_goal) return score

  const userGoal = user.relationship_goal as RelationshipGoal
  const targetGoal = target.relationship_goal as RelationshipGoal

  // Direct match
  if (userGoal === targetGoal) {
    score = 200
    matchReasons.push(`Both seeking ${userGoal.replace(/_/g, " ")}`)
    return score
  }

  // Compatible goals
  const compatiblePairs = [
    ["dating", "serious"],
    ["serious", "marriage"],
    ["casual", "dating"],
  ]

  for (const [goal1, goal2] of compatiblePairs) {
    if ((userGoal === goal1 && targetGoal === goal2) || (userGoal === goal2 && targetGoal === goal1)) {
      score = 100
      break
    }
  }

  // Conflicting goals
  if (
    (userGoal === "marriage" && targetGoal === "casual") ||
    (userGoal === "casual" && targetGoal === "marriage")
  ) {
    redFlags.push("Conflicting relationship goals")
    score = 0
  }

  return score
}

function calculateGeographicScore(user: any, target: any): number {
  let score = 0

  // Same city = 150 points
  if (user.city && target.city && user.city === target.city) {
    score = 150
  }
  // Same country but different city = 75 points
  else if (user.country && target.country && user.country === target.country) {
    score = 75
  }
  // Same country region = 40 points
  else if (user.state && target.state && user.state === target.state) {
    score = 40
  }

  return Math.min(150, score)
}

function calculateEngagementPotential(user: any, target: any, matchReasons: string[]): number {
  let score = 0

  // Recent activity
  const userLastActive = new Date(user.last_active_at || 0)
  const targetLastActive = new Date(target.last_active_at || 0)
  const daysSinceActive = (Date.now() - targetLastActive.getTime()) / (1000 * 60 * 60 * 24)

  if (daysSinceActive < 1) {
    score += 75
    matchReasons.push("Recently active")
  } else if (daysSinceActive < 7) {
    score += 40
  }

  // Profile completeness
  const targetProfileStrength = calculateProfileStrength(target)
  if (targetProfileStrength > 0.8) {
    score += 40
    matchReasons.push("Detailed profile")
  } else if (targetProfileStrength > 0.6) {
    score += 20
  }

  // Photo quality/count
  if (target.photo_count && target.photo_count >= 4) {
    score += 35
  }

  return Math.min(150, score)
}

function calculateProfileQuality(user: any, target: any): number {
  let score = 0

  // Photo count
  if (target.photo_count) {
    score += Math.min(50, target.photo_count * 12)
  }

  // Bio length (more detailed = higher score)
  const bioLength = (target.bio || "").length
  if (bioLength > 200) {
    score += 75
  } else if (bioLength > 100) {
    score += 40
  } else if (bioLength > 20) {
    score += 20
  }

  // Interests/hobbies
  if (target.interests && target.interests.length > 0) {
    score += Math.min(75, target.interests.length * 8)
  }

  return Math.min(200, score)
}

function getCommonInterests(userInterests: string[], targetInterests: string[]): string[] {
  return userInterests.filter((interest) => targetInterests.includes(interest))
}

function assessPersonalityCompatibility(type1: string, type2: string): number {
  // Simplified Myers-Briggs compatibility
  // In production, use actual MBTI compatibility data
  if (type1 === type2) return 0.9
  if (type1.charAt(0) === type2.charAt(0)) return 0.6 // Same extraversion
  return 0.5
}

function calculateProfileStrength(profile: any): number {
  let strength = 0
  const maxPoints = 10

  if (profile.bio && profile.bio.length > 100) strength += 2
  if (profile.photo_count && profile.photo_count >= 4) strength += 2
  if (profile.interests && profile.interests.length >= 5) strength += 2
  if (profile.verified) strength += 2
  if (profile.personality_type) strength += 1
  if (profile.relationship_goal) strength += 1

  return strength / maxPoints
}

function predictEngagement(
  compatibility: number,
  user: any,
  target: any,
  commonInterests: string[]
): "high" | "medium" | "low" {
  let score = compatibility

  // Boost if recently active
  const daysSinceActive = (Date.now() - new Date(target.last_active_at || 0).getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceActive < 1) score += 10
  else if (daysSinceActive < 7) score += 5

  // Boost with common interests
  score += Math.min(15, commonInterests.length * 3)

  if (score >= 85) return "high"
  if (score >= 65) return "medium"
  return "low"
}
