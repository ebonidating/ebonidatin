"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, HeartOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface FollowButtonProps {
  userId: string
  initialFollowing?: boolean
  onFollowChange?: (following: boolean) => void
}

export function FollowButton({ userId, initialFollowing = false, onFollowChange }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)

  const handleToggleFollow = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      if (following) {
        await supabase.from("user_follows").delete().match({ follower_id: user.id, following_id: userId })
      } else {
        await supabase.from("user_follows").insert({ follower_id: user.id, following_id: userId })
      }

      setFollowing(!following)
      onFollowChange?.(!following)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={following ? "default" : "outline"}
      size="sm"
      onClick={handleToggleFollow}
      disabled={loading}
      className={following ? "bg-red-600 hover:bg-red-700" : ""}
    >
      {following ? (
        <>
          <HeartOff className="h-4 w-4 mr-1" />
          Unfollow
        </>
      ) : (
        <>
          <Heart className="h-4 w-4 mr-1" />
          Follow
        </>
      )}
    </Button>
  )
}
