import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DiscoverContent from "@/components/discover-content"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DiscoverPage() {
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

  // Get potential matches (exclude self, already liked, and blocked users)
  const { data: likedIds } = await supabase.from("likes").select("liked_id").eq("liker_id", user.id)

  const { data: blockedIds } = await supabase.from("blocks").select("blocked_id").eq("blocker_id", user.id)

  const excludeIds = [
    user.id,
    ...(likedIds?.map((l) => l.liked_id) || []),
    ...(blockedIds?.map((b) => b.blocked_id) || []),
  ]

  const { data: potentialMatches } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .not("id", "in", `(${excludeIds.join(",")})`)
    .limit(20)

  return <DiscoverContent currentUserId={user.id} profiles={potentialMatches || []} />
}
