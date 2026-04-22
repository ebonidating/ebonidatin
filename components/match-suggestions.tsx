"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Heart, Sparkles, AlertCircle, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MatchScore {
  userId: string
  totalScore: number
  compatibilityPercentage: number
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

interface MatchSuggestionsProps {
  limit?: number
  minCompatibility?: number
  userId?: string
}

const BREAKDOWN_LABELS = {
  personalityMatch: "Personality",
  lifestyleMatch: "Lifestyle",
  goalAlignment: "Goals",
  geographicProximity: "Location",
  engagementPotential: "Engagement",
  profileQuality: "Profile Quality",
}

const ENGAGEMENT_COLORS = {
  high: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  low: "bg-red-100 text-red-700 border-red-300",
}

export function MatchSuggestions({
  limit = 10,
  minCompatibility = 70,
  userId,
}: MatchSuggestionsProps) {
  const [matches, setMatches] = useState<MatchScore[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(
          `/api/matches/suggestions?limit=${limit}&minCompatibility=${minCompatibility}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch matches")
        }

        const data = await response.json()
        setMatches(data.matches || [])
      } catch (error) {
        console.error("Error fetching matches:", error)
        toast({
          title: "Error",
          description: "Failed to load match suggestions",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [limit, minCompatibility, toast])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">No matches yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Complete your profile and adjust your preferences to see suggestions
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Recommended Matches</h3>
          <p className="text-sm text-muted-foreground">
            {matches.length} highly compatible profiles found
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => (
          <Card
            key={match.userId}
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
            onClick={() =>
              setExpandedMatch(expandedMatch === match.userId ? null : match.userId)
            }
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <span>Match Found</span>
                    <Badge
                      className={`${
                        match.engagementPrediction === "high"
                          ? "bg-green-100 text-green-700"
                          : match.engagementPrediction === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {match.engagementPrediction === "high" ? "🔥 High" : match.engagementPrediction === "medium" ? "⭐ Medium" : "Cold"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold text-primary">
                    {match.compatibilityPercentage}% Compatible
                  </CardDescription>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold">{match.compatibilityPercentage}</div>
                  <div className="text-xs text-muted-foreground">match score</div>
                </div>
              </div>

              {/* Compatibility Bar */}
              <Progress
                value={match.compatibilityPercentage}
                className="h-2 mt-2"
              />
            </CardHeader>

            {expandedMatch === match.userId && (
              <CardContent className="space-y-6 border-t pt-6">
                {/* Match Reasons */}
                {match.matchReasons.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Why you match
                    </h4>
                    <ul className="space-y-2">
                      {match.matchReasons.map((reason) => (
                        <li key={reason} className="text-sm flex gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Red Flags */}
                {match.redFlags && match.redFlags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      Things to note
                    </h4>
                    <ul className="space-y-2">
                      {match.redFlags.map((flag) => (
                        <li key={flag} className="text-sm flex gap-2">
                          <span className="text-amber-600 mt-0.5">!</span>
                          <span className="text-amber-700">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Common Interests */}
                {match.commonInterests.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Common Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.commonInterests.map((interest) => (
                        <Badge key={interest} variant="outline" className="bg-blue-50">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compatibility Breakdown */}
                <div>
                  <h4 className="font-semibold mb-3">Compatibility Breakdown</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(match.breakdown).map(([key, score]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {BREAKDOWN_LABELS[key as keyof typeof BREAKDOWN_LABELS]}
                          </span>
                          <span className="font-semibold">{score}</span>
                        </div>
                        <Progress value={(score / 200) * 100} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" variant="default">
                    <Heart className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button className="flex-1" variant="outline">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
