"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Music, MapPin, Briefcase, Users, Book } from "lucide-react"

interface CompatibilityData {
  overall: number // 0-100
  breakdown: {
    interests?: number
    location?: number
    lifestyle?: number
    values?: number
    culture?: number
  }
  commonInterests?: string[]
}

interface CompatibilityScoreProps {
  data: CompatibilityData
  showBreakdown?: boolean
}

export function CompatibilityScore({ data, showBreakdown = true }: CompatibilityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-gray-600'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 60) return 'from-amber-500 to-orange-600'
    return 'from-gray-400 to-gray-500'
  }

  const breakdownItems = [
    { key: 'interests', label: 'Interests', icon: Heart, value: data.breakdown.interests },
    { key: 'location', label: 'Location', icon: MapPin, value: data.breakdown.location },
    { key: 'lifestyle', label: 'Lifestyle', icon: Users, value: data.breakdown.lifestyle },
    { key: 'values', label: 'Values', icon: Book, value: data.breakdown.values },
    { key: 'culture', label: 'Culture', icon: Music, value: data.breakdown.culture },
  ].filter(item => item.value !== undefined)

  return (
    <Card className="border-2 border-amber-200 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${getScoreGradient(data.overall)}`} />
      <CardContent className="p-4 space-y-4">
        {/* Overall Score */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Compatibility Score</h3>
            <p className="text-xs text-muted-foreground">Based on your preferences</p>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(data.overall)}`}>
            {data.overall}%
          </div>
        </div>

        {/* Common Interests */}
        {data.commonInterests && data.commonInterests.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">You both like:</p>
            <div className="flex flex-wrap gap-1.5">
              {data.commonInterests.map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Breakdown */}
        {showBreakdown && breakdownItems.length > 0 && (
          <div className="space-y-3 pt-2 border-t">
            <p className="text-xs font-medium text-gray-700">Compatibility Breakdown</p>
            {breakdownItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    <span className={`font-medium ${getScoreColor(item.value!)}`}>
                      {item.value}%
                    </span>
                  </div>
                  <Progress value={item.value} className="h-1.5" />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Calculate compatibility based on user preferences
export function calculateCompatibility(
  currentUser: any,
  targetUser: any
): CompatibilityData {
  const scores = {
    interests: 0,
    location: 0,
    lifestyle: 0,
    values: 0,
    culture: 0,
  }

  const commonInterests: string[] = []

  // Interests matching
  if (currentUser.interests && targetUser.interests) {
    const userInterests = currentUser.interests
    const targetInterests = targetUser.interests
    const common = userInterests.filter((i: string) => targetInterests.includes(i))
    commonInterests.push(...common)
    scores.interests = Math.min(100, (common.length / Math.max(userInterests.length, targetInterests.length)) * 100)
  }

  // Location matching
  if (currentUser.city && targetUser.city) {
    if (currentUser.city === targetUser.city) {
      scores.location = 100
    } else if (currentUser.country === targetUser.country) {
      scores.location = 60
    } else {
      scores.location = 30
    }
  }

  // Lifestyle matching (age, education, etc.)
  let lifestyleMatches = 0
  let lifestyleChecks = 0

  if (currentUser.date_of_birth && targetUser.date_of_birth) {
    const ageDiff = Math.abs(
      new Date().getFullYear() - new Date(currentUser.date_of_birth).getFullYear() -
      (new Date().getFullYear() - new Date(targetUser.date_of_birth).getFullYear())
    )
    if (ageDiff <= 5) lifestyleMatches++
    lifestyleChecks++
  }

  if (lifestyleChecks > 0) {
    scores.lifestyle = (lifestyleMatches / lifestyleChecks) * 100
  }

  // Values matching (relationship goals, etc.)
  if (currentUser.relationship_goal && targetUser.relationship_goal) {
    scores.values = currentUser.relationship_goal === targetUser.relationship_goal ? 100 : 50
  }

  // Culture matching
  if (currentUser.cultural_background && targetUser.cultural_background) {
    const userCultures = Array.isArray(currentUser.cultural_background) 
      ? currentUser.cultural_background 
      : [currentUser.cultural_background]
    const targetCultures = Array.isArray(targetUser.cultural_background)
      ? targetUser.cultural_background
      : [targetUser.cultural_background]
    
    const culturalMatch = userCultures.some((c: string) => targetCultures.includes(c))
    scores.culture = culturalMatch ? 100 : 50
  }

  // Calculate overall score (weighted average)
  const weights = {
    interests: 0.3,
    location: 0.2,
    lifestyle: 0.2,
    values: 0.2,
    culture: 0.1,
  }

  const overall = Math.round(
    Object.entries(scores).reduce((acc, [key, value]) => {
      return acc + value * weights[key as keyof typeof weights]
    }, 0)
  )

  return {
    overall,
    breakdown: scores,
    commonInterests: commonInterests.length > 0 ? commonInterests : undefined,
  }
}
