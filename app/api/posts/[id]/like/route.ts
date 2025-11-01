import { createServerClient } from "@supabase/ssr"

export const dynamic = 'force-dynamic'
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { data: like, error } = await supabase
      .from("post_likes")
      .insert({
        post_id: params.id,
        user_id: user.id,
      })
      .select()
      .single()

    if (error && error.code !== "23505") throw error

    return NextResponse.json(like || { liked: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { error } = await supabase.from("post_likes").delete().eq("post_id", params.id).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ unliked: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to unlike post" }, { status: 500 })
  }
}
