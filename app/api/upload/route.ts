import { type NextRequest, NextResponse } from "next/server"

export const runtime = 'edge'

interface CloudflareEnv {
  UPLOADS: R2Bucket
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get R2 bucket from Cloudflare Pages env
    const env = process.env as unknown as CloudflareEnv
    const r2Bucket = env.UPLOADS

    if (!r2Bucket) {
      // Fallback: Store in Supabase Storage
      const { createClient } = await import("@/lib/supabase/server")
      const supabase = await createClient()
      
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileName = `uploads/${timestamp}-${randomString}-${file.name}`
      
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        })
      
      if (error) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName)
      
      return NextResponse.json({ url: publicUrl })
    }

    // Upload to R2
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const key = `uploads/${timestamp}-${randomString}-${file.name}`
    
    const arrayBuffer = await file.arrayBuffer()
    
    await r2Bucket.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    })

    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || `https://pub-${process.env.NEXT_PUBLIC_R2_BUCKET_ID}.r2.dev`
    const url = `${publicUrl}/${key}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream, options?: any): Promise<any>
  get(key: string, options?: any): Promise<any>
  delete(keys: string | string[]): Promise<void>
}
