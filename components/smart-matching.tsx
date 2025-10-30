"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Zap } from "lucide-react"

interface MatchScore {
  match_id: string
  compatibility_score: number
  interests_match: number
  age_compatibility: number
}

export function SmartMatching({ userId }: { userId: string }) {
  const [matches, setMatches] = useState<MatchScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("smart_matching_scores")
          .select("*")
          .eq("user_id", userId)
          .order("compatibility_score", { ascending: false })
          .limit(5)

        if (error) throw error
        setMatches(data || [])
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [userId])

  if (loading) return <div>Loading matches...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Smart Matches
        </CardTitle>
        <CardDescription>Based on your interests and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.map((match) => (
          <div key={match.match_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium">{match.compatibility_score}% Compatible</p>
                <p className="text-sm text-gray-600">{match.interests_match} interests match</p>
              </div>
            </div>
            <Badge variant="secondary">{match.age_compatibility}% age match</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
