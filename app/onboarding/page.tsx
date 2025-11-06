import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SinglePageOnboarding from "@/components/single-page-onboarding"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if profile is already complete
  const { data: profile } = await supabase.from("profiles").select("profile_completion").eq("id", user.id).single()

  // If profile is complete (>= 70%), redirect to dashboard
  if (profile && profile.profile_completion >= 70) {
    redirect("/dashboard")
  }

  return <SinglePageOnboarding userId={user.id} userEmail={user.email!} />
}
