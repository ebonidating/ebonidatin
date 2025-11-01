import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardContent from "@/components/dashboard-content"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if profile exists
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // If no profile, redirect to onboarding
  if (!profile) {
    redirect("/onboarding")
  }

  return <DashboardContent profile={profile} />
}
