import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all verified models with their posts and calculate total likes
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, display_name, profile_photo_url, bio, followers_count, user_type")
      .eq("user_type", "model")
      .eq("email_verified", true)
      .eq("is_verified", true)

    if (profilesError || !profiles || profiles.length === 0) {
      return NextResponse.json({ error: "No verified models found" }, { status: 404 })
    }

    // Get posts with likes for each model
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("user_id, likes_count")
      .in(
        "user_id",
        profiles.map((p) => p.id),
      )

    if (postsError) {
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
    }

    // Calculate total likes per model
    const modelLikes = profiles.map((profile) => {
      const totalLikes = posts
        .filter((post) => post.user_id === profile.id)
        .reduce((sum, post) => sum + (post.likes_count || 0), 0)

      return {
        ...profile,
        total_likes: totalLikes,
        posts_count: posts.filter((post) => post.user_id === profile.id).length,
      }
    })

    // Sort by total likes and get the top model
    const topModel = modelLikes.sort((a, b) => b.total_likes - a.total_likes)[0]

    if (!topModel) {
      return NextResponse.json({ error: "No model with posts found" }, { status: 404 })
    }

    return NextResponse.json({
      id: topModel.id,
      full_name: topModel.full_name,
      display_name: topModel.display_name,
      profile_photo_url: topModel.profile_photo_url,
      bio: topModel.bio,
      followers_count: topModel.followers_count || 0,
      total_likes: topModel.total_likes,
      posts_count: topModel.posts_count,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch model of the day" }, { status: 500 })
  }
}
