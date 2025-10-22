"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Zap, Target, Award, Crown } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

interface GamificationDashboardProps {
  userId: string
  level: number
  xp: number
  xpToNextLevel: number
  achievements: Achievement[]
  dailyQuests: {
    id: string
    title: string
    description: string
    reward: number
    progress: number
    maxProgress: number
    completed: boolean
  }[]
  leaderboardPosition?: number
}

export function GamificationDashboard({
  level,
  xp,
  xpToNextLevel,
  achievements,
  dailyQuests,
  leaderboardPosition,
}: GamificationDashboardProps) {
  const xpProgress = (xp / xpToNextLevel) * 100

  const iconMap: Record<string, any> = {
    trophy: Trophy,
    star: Star,
    zap: Zap,
    target: Target,
    award: Award,
    crown: Crown,
  }

  return (
    <div className="space-y-6">
      {/* Level & XP */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              <CardTitle>Level {level}</CardTitle>
            </div>
            {leaderboardPosition && (
              <Badge className="bg-amber-600">
                <Trophy className="h-3 w-3 mr-1" />#{leaderboardPosition}
              </Badge>
            )}
          </div>
          <CardDescription>
            {xp} / {xpToNextLevel} XP to next level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={xpProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Daily Quests */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-600" />
            <CardTitle>Daily Quests</CardTitle>
          </div>
          <CardDescription>Complete quests to earn XP and rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyQuests.map((quest) => (
            <div key={quest.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{quest.title}</p>
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                </div>
                {quest.completed ? (
                  <Badge className="bg-green-500">Completed</Badge>
                ) : (
                  <Badge variant="outline">+{quest.reward} XP</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(quest.progress / quest.maxProgress) * 100} className="flex-1" />
                <span className="text-sm text-muted-foreground">
                  {quest.progress}/{quest.maxProgress}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-600" />
            <CardTitle>Achievements</CardTitle>
          </div>
          <CardDescription>
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = iconMap[achievement.icon] || Trophy

              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 text-center ${
                    achievement.unlocked
                      ? "border-amber-300 bg-amber-50"
                      : "border-border bg-muted opacity-50 grayscale"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`p-3 rounded-full ${achievement.unlocked ? "bg-amber-500" : "bg-muted-foreground"}`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="w-full h-1" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
