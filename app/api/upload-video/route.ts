import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = 'edge'

interface CloudflareEnv {
  UPLOADS: R2Bucket
}

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

    // Get R2 bucket from Cloudflare Pages env
    const env = process.env as unknown as CloudflareEnv
    const r2Bucket = env.UPLOADS
    
    let videoUrl: string

    if (r2Bucket) {
      // Upload to R2
      const timestamp = Date.now()
      const key = `videos/${user.id}/${timestamp}-${file.name}`
      
      const arrayBuffer = await file.arrayBuffer()
      
      await r2Bucket.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
      })

      const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || `https://pub-${process.env.NEXT_PUBLIC_R2_BUCKET_ID}.r2.dev`
      videoUrl = `${publicUrl}/${key}`
    } else {
      // Fallback: Use Supabase Storage
      const timestamp = Date.now()
      const fileName = `videos/${user.id}/${timestamp}-${file.name}`
      
      const { data, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        })
      
      if (uploadError) {
        return NextResponse.json({ error: "Video upload failed" }, { status: 500 })
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName)
      
      videoUrl = publicUrl
    }

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        title,
        description,
        video_url: videoUrl,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream, options?: any): Promise<any>
  get(key: string, options?: any): Promise<any>
  delete(keys: string | string[]): Promise<void>
}
