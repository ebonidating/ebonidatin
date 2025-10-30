"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, User, MessageCircle, Settings, LogOut, MapPin, Video } from "lucide-react"
import Link from "next/link"

interface Profile {
  id: string
  email: string
  full_name: string | null
  display_name: string | null
  bio: string | null
  date_of_birth: string | null
  gender: string | null
  city: string | null
  state: string | null
  country: string | null
  looking_for: string | null
  interests: string[] | null
  membership_tier: string
  is_verified: boolean
  created_at: string
}

interface DashboardContentProps {
  profile: Profile
}

export default function DashboardContent({ profile }: DashboardContentProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
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

  const age = calculateAge(profile.date_of_birth)

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-cyan-600 fill-cyan-600" />
            <span className="text-xl font-bold text-gray-900">Eboni Dating</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild aria-label="Messages">
              <Link href="/messages">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Settings">
              <Link href="/profile/edit">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} disabled={isLoggingOut} aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {profile.display_name || profile.full_name}!
            </h1>
            <p className="text-muted-foreground">Ready to make meaningful connections today?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="bg-cyan-100 text-cyan-600 text-2xl">
                      {getInitials(profile.display_name || profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">
                    {profile.display_name || profile.full_name}
                    {age && <span className="text-muted-foreground">, {age}</span>}
                  </h3>
                  {profile.is_verified && (
                    <Badge className="mt-2 bg-cyan-100 text-cyan-700 border-cyan-200">Verified</Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {profile.city && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {profile.city}
                        {profile.state && `, ${profile.state}`}
                      </span>
                    </div>
                  )}
                  {profile.gender && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{profile.gender}</span>
                    </div>
                  )}
                  {profile.looking_for && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{profile.looking_for}</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  </div>
                )}

                {profile.interests && profile.interests.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Link href="/profile/edit">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href="/discover">
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-3">
                        <Heart className="h-6 w-6 text-cyan-600" />
                      </div>
                      <h3 className="font-semibold mb-1">Discover</h3>
                      <p className="text-sm text-muted-foreground">Find new connections</p>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href="/matches">
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-1">Matches</h3>
                      <p className="text-sm text-muted-foreground">View your matches</p>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href="/dashboard/posts">
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
                        <Video className="h-6 w-6 text-pink-600" />
                      </div>
                      <h3 className="font-semibold mb-1">Video Posts</h3>
                      <p className="text-sm text-muted-foreground">Share your moments</p>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href="/messages">
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-1">Messages</h3>
                      <p className="text-sm text-muted-foreground">Chat with matches</p>
                    </CardContent>
                  </Link>
                </Card>
              </div>

              {/* Membership Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Membership</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold capitalize">{profile.membership_tier} Plan</p>
                      <p className="text-sm text-muted-foreground">Upgrade to unlock more features</p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/pricing">Upgrade</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Getting Started */}
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Real onboarding steps would go here */}
                  {/* Placeholder for real onboarding steps */}
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold">✓</span>
                    </div>
                    <div>
                      <p className="font-medium">Complete Your Profile</p>
                      <p className="text-sm text-muted-foreground">Add more details to your profile</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-semibold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Start Discovering</p>
                      <p className="text-sm text-muted-foreground">Browse profiles and find people you connect with</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-semibold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Make Connections</p>
                      <p className="text-sm text-muted-foreground">
                        Like profiles and start conversations when you match
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {isLoggingOut && <p>Logging out...</p>}
        </div>
      </main>
    </div>
  )
}
