import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = createClient()
    const { error: sessionError, data: sessionData } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    if (sessionData.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", sessionData.user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      if (!profile) {
        return NextResponse.redirect(`${origin}/onboarding`)
      } else {
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
