import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProfileEditForm from "@/components/profile-edit-form"

export default async function ProfileEditPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/onboarding")
  }

  return <ProfileEditForm profile={profile} />
}
