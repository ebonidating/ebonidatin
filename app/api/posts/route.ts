import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    },
  )

  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        description,
        image_url,
        image_urls,
        likes_count,
        comments_count,
        created_at,
        user_id,
        profiles:user_id (
          id,
          display_name,
          profile_photo_url
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    },
  )

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, image_url, image_urls } = body

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        title,
        description,
        image_url,
        image_urls,
        post_type: image_urls ? "carousel" : "photo",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
