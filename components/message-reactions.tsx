"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"

interface MessageReactionsProps {
  messageId: string
  currentReactions?: { emoji: string; userId: string }[]
  currentUserId: string
}

const quickReactions = ["❤️", "😂", "😮", "😢", "😡", "👍", "👎", "🔥"]

export function MessageReactions({ messageId, currentReactions = [], currentUserId }: MessageReactionsProps) {
  const [reactions, setReactions] = useState(currentReactions)
  const [showPicker, setShowPicker] = useState(false)

  const addReaction = async (emoji: string) => {
    try {
      const supabase = createClient()

      // Check if user already reacted with this emoji
      const existingReaction = reactions.find((r) => r.emoji === emoji && r.userId === currentUserId)

      if (existingReaction) {
        // Remove reaction
        const newReactions = reactions.filter((r) => !(r.emoji === emoji && r.userId === currentUserId))
        setReactions(newReactions)

        await supabase
          .from("message_reactions")
          .delete()
          .eq("message_id", messageId)
          .eq("user_id", currentUserId)
          .eq("emoji", emoji)
      } else {
        // Add reaction
        const newReaction = { emoji, userId: currentUserId }
        setReactions([...reactions, newReaction])

        await supabase.from("message_reactions").insert({
          message_id: messageId,
          user_id: currentUserId,
          emoji,
          created_at: new Date().toISOString(),
        })
      }

      setShowPicker(false)
    } catch (error) {
      console.error("[v0] Reaction error:", error)
    }
  }

  // Group reactions by emoji
  const groupedReactions = reactions.reduce(
    (acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = []
      }
      acc[reaction.emoji].push(reaction.userId)
      return acc
    },
    {} as Record<string, string[]>,
  )

  return (
    <div className="flex items-center gap-1 mt-1">
      {Object.entries(groupedReactions).map(([emoji, userIds]) => (
        <button
          key={emoji}
          onClick={() => addReaction(emoji)}
          className={`text-xs px-2 py-1 rounded-full border transition-colors ${
            userIds.includes(currentUserId) ? "bg-amber-100 border-amber-300" : "bg-muted border-border hover:bg-accent"
          }`}
        >
          {emoji} {userIds.length}
        </button>
      ))}

      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-xs">
            +
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex gap-1">
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addReaction(emoji)}
                className="text-2xl hover:scale-125 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
