import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { VideoCallInterface } from "@/components/video-call-interface"
import { Heart } from "lucide-react"
import Link from "next/link"

export default async function VideoCallPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const otherUserId = params.user

  if (!otherUserId) {
    redirect("/messages")
  }

  // Get the other user's profile
  const { data: otherUserProfile } = await supabase.from("profiles").select("*").eq("id", otherUserId).single()

  if (!otherUserProfile) {
    redirect("/messages")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-cyan-600 fill-cyan-600" />
            <span className="text-xl font-bold text-gray-900">Eboni Dating</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <VideoCallInterface
            otherUserName={otherUserProfile.display_name || otherUserProfile.full_name || "User"}
            onEndCall={() => {
              window.location.href = `/messages/chat?user=${otherUserId}`
            }}
          />
        </div>
      </div>
    </div>
  )
}
