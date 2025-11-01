"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, RefreshCw } from "lucide-react"

interface IcebreakerProps {
  profileData?: {
    interests?: string[]
    profession?: string
    location?: string
    bio?: string
  }
  onSelectIcebreaker?: (text: string) => void
}

const culturalIcebreakers = [
  "What's your favorite African/Caribbean dish, and who makes it best? 🍲",
  "If you could visit any African country, which would it be and why? ✈️",
  "What song always gets you on the dance floor? 💃",
  "Jollof rice debate: Ghana or Nigeria? 😄",
  "What's a cultural tradition you'd love to share with someone special? 🌍",
  "Best Black movie of all time - what's your pick? 🎬",
  "If you could have dinner with any historical Black figure, who would it be? 🍽️",
  "What's your go-to comfort food after a long day? 😋",
  "Are you more of an Afrobeats or Old School R&B person? 🎵",
  "What's something about your culture you're really proud of? ✨",
]

const funIcebreakers = [
  "Two truths and a lie - ready? I'll go first! 🎲",
  "What's the most spontaneous thing you've ever done? 🌟",
  "Coffee date or wine night - which would you pick? ☕🍷",
  "What's your hidden talent that surprises people? 🎭",
  "Beach vacation or city adventure? 🏖️🏙️",
  "Morning person or night owl? ☀️🌙",
  "What's on your bucket list for this year? 📝",
  "Netflix binge or going out - what's your vibe tonight? 📺",
  "What's your favorite way to spend a Sunday? 😊",
  "If you could master any skill instantly, what would it be? 🎯",
]

const deepIcebreakers = [
  "What's something you're passionate about that people might not expect? 💭",
  "What does your ideal weekend look like? 🌅",
  "What's the best advice you've ever received? 💡",
  "What are you most grateful for right now? 🙏",
  "What's something you're working on improving about yourself? 🌱",
  "What makes you feel most alive? ✨",
  "Where do you see yourself in 5 years? 🔮",
  "What's your love language? ❤️",
  "What's a deal-breaker for you in a relationship? 🚫",
  "What are three things you can't live without? 📱",
]

export function Icebreakers({ profileData, onSelectIcebreaker }: IcebreakerProps) {
  const [currentCategory, setCurrentCategory] = useState<'cultural' | 'fun' | 'deep'>('cultural')
  const [currentIcebreaker, setCurrentIcebreaker] = useState('')

  const getRandomIcebreaker = (category: 'cultural' | 'fun' | 'deep') => {
    const icebreakers = category === 'cultural' ? culturalIcebreakers :
                       category === 'fun' ? funIcebreakers : deepIcebreakers
    return icebreakers[Math.floor(Math.random() * icebreakers.length)]
  }

  const generateIcebreaker = (category: 'cultural' | 'fun' | 'deep') => {
    setCurrentCategory(category)
    setCurrentIcebreaker(getRandomIcebreaker(category))
  }

  const refreshIcebreaker = () => {
    setCurrentIcebreaker(getRandomIcebreaker(currentCategory))
  }

  const useIcebreaker = () => {
    if (onSelectIcebreaker && currentIcebreaker) {
      onSelectIcebreaker(currentIcebreaker)
    }
  }

  return (
    <Card className="w-full border-amber-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-lg">Conversation Starters</CardTitle>
        </div>
        <CardDescription>
          Break the ice with a thoughtful question
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={currentCategory === 'cultural' ? 'default' : 'outline'}
            onClick={() => generateIcebreaker('cultural')}
            className={currentCategory === 'cultural' ? 'bg-amber-600 hover:bg-amber-700' : ''}
          >
            🌍 Cultural
          </Button>
          <Button
            size="sm"
            variant={currentCategory === 'fun' ? 'default' : 'outline'}
            onClick={() => generateIcebreaker('fun')}
            className={currentCategory === 'fun' ? 'bg-amber-600 hover:bg-amber-700' : ''}
          >
            🎉 Fun
          </Button>
          <Button
            size="sm"
            variant={currentCategory === 'deep' ? 'default' : 'outline'}
            onClick={() => generateIcebreaker('deep')}
            className={currentCategory === 'deep' ? 'bg-amber-600 hover:bg-amber-700' : ''}
          >
            💭 Deep
          </Button>
        </div>

        {/* Icebreaker Display */}
        {currentIcebreaker && (
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-gray-800">{currentIcebreaker}</p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={refreshIcebreaker}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Question
              </Button>
              <Button
                size="sm"
                onClick={useIcebreaker}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                Use This
              </Button>
            </div>
          </div>
        )}

        {!currentIcebreaker && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Choose a category to get started! 👆
          </p>
        )}
      </CardContent>
    </Card>
  )
}
