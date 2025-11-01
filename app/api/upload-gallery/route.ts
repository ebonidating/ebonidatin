import { put } from "@vercel/blob"

export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check subscription tier for gallery access
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, gallery_access")
      .eq("id", user.id)
      .single()

    if (!profile?.gallery_access) {
      return NextResponse.json({ error: "Gallery access requires premium subscription" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // 'image' or 'video'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (type === "image" && !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    if (type === "video" && !file.type.startsWith("video/")) {
      return NextResponse.json({ error: "File must be a video" }, { status: 400 })
    }

    // Validate file size (images: 10MB, videos: 100MB)
    const maxSize = type === "image" ? 10 * 1024 * 1024 : 100 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File size must be less than ${type === "image" ? "10MB" : "100MB"}`,
        },
        { status: 400 },
      )
    }

    // Upload to Vercel Blob
    const timestamp = Date.now()
    const folder = type === "image" ? "gallery-images" : "gallery-videos"
    const filename = `${folder}/${user.id}/${timestamp}-${file.name}`

    const blob = await put(filename, file, {
      access: "public",
    })

    // Create post entry
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        post_type: type,
        [type === "image" ? "image_url" : "video_url"]: blob.url,
        title: file.name,
        description: "",
      })
      .select()
      .single()

    if (postError) {
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
      postId: post.id,
    })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
