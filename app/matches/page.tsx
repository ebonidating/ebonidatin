import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import MatchesContent from "@/components/matches-content"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MatchesPage() {
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

  // Get all matches for the current user
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
    .eq("is_active", true)
    .order("matched_at", { ascending: false })

  // Get profile details for all matched users
  const matchedUserIds =
    matches?.map((match) => (match.user_id_1 === user.id ? match.user_id_2 : match.user_id_1)) || []

  const { data: matchedProfiles } = await supabase.from("profiles").select("*").in("id", matchedUserIds)

  // Combine matches with profile data
  const matchesWithProfiles =
    matches?.map((match) => {
      const matchedUserId = match.user_id_1 === user.id ? match.user_id_2 : match.user_id_1
      const matchedProfile = matchedProfiles?.find((p) => p.id === matchedUserId)
      return {
        ...match,
        profile: matchedProfile,
      }
    }) || []

  return <MatchesContent matches={matchesWithProfiles} />
}
