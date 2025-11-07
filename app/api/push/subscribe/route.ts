export const dynamic = "force-dynamic"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { subscription } = await req.json()

    // Store the subscription in Supabase
    const { error } = await supabase.from("subscriptions").insert({ subscription })
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
