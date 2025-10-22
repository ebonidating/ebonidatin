"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PostCardProps {
  id: string
  author: {
    id: string
    name: string
    avatar: string
  }
  image?: string
  images?: string[]
  title: string
  description: string
  likesCount: number
  commentsCount: number
  isLiked?: boolean
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
}

export function PostCard({
  id,
  author,
  image,
  images,
  title,
  description,
  likesCount,
  commentsCount,
  isLiked = false,
  onLike,
  onComment,
  onShare,
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likes, setLikes] = useState(likesCount)

  const handleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
    onLike?.(id)
  }

  const displayImage = image || images?.[0]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-900">{author.name}</p>
          <p className="text-xs text-gray-500">Model • Verified</p>
        </div>
      </div>

      {/* Image */}
      {displayImage && (
        <div className="w-full h-96 overflow-hidden bg-gray-100">
          <img
            src={displayImage || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 ${liked ? "text-red-500" : "text-gray-600"}`}
            onClick={handleLike}
          >
            <Heart className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
            <span className="text-sm">{likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600"
            onClick={() => onComment?.(id)}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{commentsCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600"
            onClick={() => onShare?.(id)}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="text-xs text-gray-500">
          <p>
            {likes} likes • {commentsCount} comments
          </p>
        </div>
      </div>
    </div>
  )
}
