import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import MessagesContent from "@/components/messages-content"

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ match?: string }>
}) {
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

  // Get last message for each match
  const conversationsWithProfiles = await Promise.all(
    (matches || []).map(async (match) => {
      const matchedUserId = match.user_id_1 === user.id ? match.user_id_2 : match.user_id_1
      const matchedProfile = matchedProfiles?.find((p) => p.id === matchedUserId)

      // Get last message
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", match.id)
        .order("sent_at", { ascending: false })
        .limit(1)
        .single()

      // Get unread count
      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("match_id", match.id)
        .eq("receiver_id", user.id)
        .eq("is_read", false)

      return {
        match,
        profile: matchedProfile,
        lastMessage,
        unreadCount: unreadCount || 0,
      }
    }),
  )

  // Sort by last message time
  conversationsWithProfiles.sort((a, b) => {
    const aTime = a.lastMessage?.sent_at || a.match.matched_at
    const bTime = b.lastMessage?.sent_at || b.match.matched_at
    return new Date(bTime).getTime() - new Date(aTime).getTime()
  })

  const params = await searchParams
  const selectedMatchId = params.match

  return (
    <MessagesContent
      currentUserId={user.id}
      conversations={conversationsWithProfiles}
      selectedMatchId={selectedMatchId}
    />
  )
}
