import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
import { put } from "@vercel/blob"
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

    const formData = await request.formData()
    const file = formData.get("video") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }

    const blob = await put(`videos/${user.id}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        title,
        description,
        video_url: blob.url,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
