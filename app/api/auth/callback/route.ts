import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = createClient()
    const { error: sessionError, data: sessionData } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
    }

    if (sessionData.user) {
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionData.user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile fetch error:", profileError)
      }

      // Auto-create or update profile with Google data
      if (!profile) {
        const userMetadata = sessionData.user.user_metadata
        
        await supabase.from("profiles").insert({
          id: sessionData.user.id,
          email: sessionData.user.email,
          full_name: userMetadata.full_name || userMetadata.name || "",
          avatar_url: userMetadata.avatar_url || userMetadata.picture || null,
          subscription_tier: "free",
          email_verified: true,
          created_at: new Date().toISOString(),
        })

        // If we have all required data from Google, go to dashboard
        // Otherwise go to onboarding to complete profile
        if (userMetadata.full_name || userMetadata.name) {
          return NextResponse.redirect(`${origin}/dashboard`)
        } else {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      } else {
        // Profile exists, update avatar if available
        const userMetadata = sessionData.user.user_metadata
        if (userMetadata.avatar_url || userMetadata.picture) {
          await supabase
            .from("profiles")
            .update({ 
              avatar_url: userMetadata.avatar_url || userMetadata.picture,
              email_verified: true 
            })
            .eq("id", sessionData.user.id)
        }

        // Redirect to dashboard
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
}
