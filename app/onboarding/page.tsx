import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import OnboardingForm from "@/components/onboarding-form"

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

  // Check if profile already exists
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // If profile exists, redirect to dashboard
  if (profile) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <OnboardingForm userId={user.id} userEmail={user.email!} />
      </div>
    </div>
  )
}
