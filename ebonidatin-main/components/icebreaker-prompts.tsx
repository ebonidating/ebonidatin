"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface IcebreakerPromptsProps {
  onSelectPrompt: (prompt: string) => void
}

const icebreakers = [
  "What's your favorite way to spend a weekend?",
  "If you could travel anywhere right now, where would you go?",
  "What's the best concert or show you've ever been to?",
  "What's your go-to comfort food?",
  "What's something you're passionate about?",
  "If you could have dinner with anyone, dead or alive, who would it be?",
  "What's your favorite childhood memory?",
  "What's the most adventurous thing you've ever done?",
  "What's your hidden talent?",
  "What's the best advice you've ever received?",
]

export function IcebreakerPrompts({ onSelectPrompt }: IcebreakerPromptsProps) {
  const randomPrompts = icebreakers.sort(() => Math.random() - 0.5).slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <CardTitle>Icebreaker Questions</CardTitle>
        </div>
        <CardDescription>Start the conversation with these fun prompts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {randomPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left h-auto py-3 px-4 bg-transparent"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
