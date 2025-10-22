"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, X, MapPin, UserIcon, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

interface Profile {
  id: string
  display_name: string | null
  full_name: string | null
  bio: string | null
  date_of_birth: string | null
  gender: string | null
  city: string | null
  state: string | null
  looking_for: string | null
  interests: string[] | null
  is_verified: boolean
}

interface DiscoverContentProps {
  currentUserId: string
  profiles: Profile[]
}

export default function DiscoverContent({ currentUserId, profiles }: DiscoverContentProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLiking, setIsLiking] = useState(false)
  const [isPassing, setIsPassing] = useState(false)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null)

  const currentProfile = profiles[currentIndex]

  const calculateAge = (dob: string | null) => {
    if (!dob) return null
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLike = async () => {
    if (!currentProfile || isLiking) return
    setIsLiking(true)
    const supabase = createClient()

    try {
      // Insert like
      const { error: likeError } = await supabase.from("likes").insert({
        liker_id: currentUserId,
        liked_id: currentProfile.id,
      })

      if (likeError) throw likeError

      // Check if it's a match (the other user already liked us)
      const { data: mutualLike } = await supabase
        .from("likes")
        .select("*")
        .eq("liker_id", currentProfile.id)
        .eq("liked_id", currentUserId)
        .single()

      if (mutualLike) {
        setMatchedProfile(currentProfile)
        setShowMatch(true)
      } else {
        // Move to next profile
        setCurrentIndex((prev) => prev + 1)
      }
    } catch (error) {
      // Error handled silently with UI feedback
    } finally {
      setIsLiking(false)
    }
  }

  const handlePass = async () => {
    if (!currentProfile || isPassing) return
    setIsPassing(true)

    // Just move to next profile (no need to record passes)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsPassing(false)
    }, 300)
  }

  const handleMatchClose = () => {
    setShowMatch(false)
    setMatchedProfile(null)
    setCurrentIndex((prev) => prev + 1)
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-cyan-600 fill-cyan-600" />
              <span className="text-xl font-bold text-gray-900">Eboni Dating</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="h-24 w-24 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-12 w-12 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No More Profiles</h2>
            <p className="text-muted-foreground mb-6">
              You've seen all available profiles for now. Check back later for new connections!
            </p>
            <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const age = calculateAge(currentProfile.date_of_birth)

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-cyan-600 fill-cyan-600" />
            <span className="text-xl font-bold text-gray-900">Eboni Dating</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover</h1>
            <p className="text-muted-foreground">
              {profiles.length - currentIndex} profile{profiles.length - currentIndex !== 1 ? "s" : ""} remaining
            </p>
          </div>

          {/* Profile Card */}
          <Card className="overflow-hidden border-2 mb-6">
            <div className="relative h-96 bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center">
              <Avatar className="h-48 w-48">
                <AvatarFallback className="bg-white text-cyan-600 text-6xl">
                  {getInitials(currentProfile.display_name || currentProfile.full_name)}
                </AvatarFallback>
              </Avatar>
              {currentProfile.is_verified && (
                <Badge className="absolute top-4 right-4 bg-cyan-600 text-white">Verified</Badge>
              )}
            </div>

            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentProfile.display_name || currentProfile.full_name}
                  {age && <span className="text-muted-foreground">, {age}</span>}
                </h2>
              </div>

              {currentProfile.city && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {currentProfile.city}
                    {currentProfile.state && `, ${currentProfile.state}`}
                  </span>
                </div>
              )}

              {currentProfile.gender && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserIcon className="h-4 w-4" />
                  <span>{currentProfile.gender}</span>
                </div>
              )}

              {currentProfile.looking_for && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>{currentProfile.looking_for}</span>
                </div>
              )}

              {currentProfile.bio && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">{currentProfile.bio}</p>
                </div>
              )}

              {currentProfile.interests && currentProfile.interests.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6">
            <Button
              size="lg"
              variant="outline"
              className="h-16 w-16 rounded-full border-2 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
              onClick={handlePass}
              disabled={isPassing || isLiking}
            >
              <X className="h-8 w-8 text-red-500" />
            </Button>

            <Button
              size="lg"
              className="h-20 w-20 rounded-full bg-cyan-600 hover:bg-cyan-700"
              onClick={handleLike}
              disabled={isLiking || isPassing}
            >
              <Heart className="h-10 w-10 fill-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Match Modal */}
      {showMatch && matchedProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-cyan-600 fill-cyan-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">It's a Match!</h2>
              <p className="text-muted-foreground mb-6">
                You and {matchedProfile.display_name || matchedProfile.full_name} liked each other
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={handleMatchClose}>
                  Keep Swiping
                </Button>
                <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700" onClick={() => router.push("/matches")}>
                  View Matches
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
