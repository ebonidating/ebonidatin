import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  
  // Use production URL if available, fallback to origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_URL || new URL(request.url).origin

  if (code) {
    const supabase = await createClient()
    const { error: sessionError, data: sessionData } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_failed`)
    }

    if (sessionData.user) {
      try {
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*, onboarding_progress(*)")
          .eq("id", sessionData.user.id)
          .single()

        const userMetadata = sessionData.user.user_metadata
        const isOAuthProvider = userMetadata.provider === 'google' || userMetadata.provider === 'facebook'

        // Profile doesn't exist - create it
        if (profileError && profileError.code === "PGRST116") {
          const authProvider = isOAuthProvider ? userMetadata.provider : 'email'
          const displayName = userMetadata.full_name || userMetadata.name || sessionData.user.email?.split('@')[0] || ''
          
          await supabase.from("profiles").insert({
            id: sessionData.user.id,
            email: sessionData.user.email,
            full_name: displayName,
            display_name: displayName,
            profile_photo_url: userMetadata.avatar_url || userMetadata.picture || null,
            auth_provider: authProvider,
            oauth_provider_id: userMetadata.sub || null,
            subscription_tier: "free",
            email_verified: true,
            last_login_at: new Date().toISOString(),
            login_count: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          // Check onboarding status
          const { data: onboardingData } = await supabase
            .from("onboarding_progress")
            .select("*")
            .eq("user_id", sessionData.user.id)
            .single()

          // Redirect based on onboarding completion
          if (!onboardingData || !onboardingData.onboarding_completed_at) {
            return NextResponse.redirect(`${baseUrl}/onboarding?step=1&source=oauth`)
          }
          
          return NextResponse.redirect(`${baseUrl}/dashboard?welcome=true`)
        }

        // Profile exists - update it
        if (profile) {
          const updateData: any = {
            email_verified: true,
            last_login_at: new Date().toISOString(),
            login_count: (profile.login_count || 0) + 1,
            updated_at: new Date().toISOString(),
          }

          // Update avatar if from OAuth and has new image
          if (isOAuthProvider && (userMetadata.avatar_url || userMetadata.picture)) {
            updateData.profile_photo_url = userMetadata.avatar_url || userMetadata.picture
          }

          await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", sessionData.user.id)

          // Check if needs onboarding
          if (!profile.onboarding_completed) {
            const { data: onboardingData } = await supabase
              .from("onboarding_progress")
              .select("current_step")
              .eq("user_id", sessionData.user.id)
              .single()

            const currentStep = onboardingData?.current_step || 1
            return NextResponse.redirect(`${baseUrl}/onboarding?step=${currentStep}&source=callback`)
          }

          // User is verified and onboarded - go to dashboard
          return NextResponse.redirect(`${baseUrl}/dashboard`)
        }

      } catch (error) {
        console.error("Profile handling error:", error)
        // On error, try to redirect safely
        return NextResponse.redirect(`${baseUrl}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${baseUrl}/auth/login?error=no_code`)
}
