"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Eye, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Post {
  id: string
  user_id: string
  title: string
  description: string | null
  video_url: string
  views: number
  likes: number
  created_at: string
  profiles: {
    full_name: string | null
    display_name: string | null
  }
}

export function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles (
            full_name,
            display_name
          )
        `,
        )
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error

      setPosts(data || [])
    } catch (err) {
      console.error("[v0] Error fetching posts:", err)
      setError("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const supabase = createClient()
      const post = posts.find((p) => p.id === postId)
      if (!post) return

      const { error } = await supabase
        .from("posts")
        .update({ likes: post.likes + 1 })
        .eq("id", postId)

      if (error) throw error

      // Update local state
      setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)))
    } catch (err) {
      console.error("[v0] Error liking post:", err)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-cyan-100 text-cyan-600">
                  {getInitials(post.profiles?.display_name || post.profiles?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">
                  {post.profiles?.display_name || post.profiles?.full_name || "Anonymous"}
                </CardTitle>
                <CardDescription>{new Date(post.created_at).toLocaleDateString()}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
              {post.description && <p className="text-muted-foreground text-sm">{post.description}</p>}
            </div>

            <div className="rounded-lg overflow-hidden bg-black">
              <video controls className="w-full max-h-[500px]" preload="metadata">
                <source src={post.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)} className="gap-2">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Comment</span>
              </Button>
              <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
