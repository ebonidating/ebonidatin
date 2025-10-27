"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MapPin, MessageCircle, ArrowLeft, Users } from "lucide-react"
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
  interests: string[] | null
  is_verified: boolean
}

interface Match {
  id: string
  matched_at: string
  profile: Profile | undefined
}

interface MatchesContentProps {
  matches: Match[]
}

export default function MatchesContent({ matches }: MatchesContentProps) {
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

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
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
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Matches</h1>
            <p className="text-muted-foreground">
              {matches.length} {matches.length === 1 ? "match" : "matches"}
            </p>
          </div>

          {matches.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="h-20 w-20 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-cyan-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Matches Yet</h2>
                <p className="text-muted-foreground mb-6">Start discovering profiles to find your perfect match!</p>
                <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                  <Link href="/discover">Start Discovering</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {matches.map((match) => {
                if (!match.profile) return null
                const age = calculateAge(match.profile.date_of_birth)

                return (
                  <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-white text-cyan-600 text-3xl">
                          {getInitials(match.profile.display_name || match.profile.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      {match.profile.is_verified && (
                        <Badge className="absolute top-3 right-3 bg-cyan-600 text-white">Verified</Badge>
                      )}
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {match.profile.display_name || match.profile.full_name}
                          {age && <span className="text-muted-foreground">, {age}</span>}
                        </h3>
                        <p className="text-sm text-muted-foreground">Matched {formatMatchDate(match.matched_at)}</p>
                      </div>

                      {match.profile.city && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {match.profile.city}
                            {match.profile.state && `, ${match.profile.state}`}
                          </span>
                        </div>
                      )}

                      {match.profile.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{match.profile.bio}</p>
                      )}

                      {match.profile.interests && match.profile.interests.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {match.profile.interests.slice(0, 3).map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {match.profile.interests.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{match.profile.interests.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                        <Link href={`/messages?match=${match.id}`}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Message
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
