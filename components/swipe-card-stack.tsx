"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, X, Star, MapPin, Briefcase, GraduationCap, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  id: string
  full_name: string
  age?: number
  city: string
  country: string
  bio?: string
  interests?: string[]
  occupation?: string
  education?: string
  photos?: string[]
  distance?: number
}

interface SwipeCardStackProps {
  userId: string
  initialProfiles: Profile[]
}

export function SwipeCardStack({ userId, initialProfiles }: SwipeCardStackProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showDetails, setShowDetails] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const currentProfile = profiles[currentIndex]
  const modelImages = ["/model-1.jpg", "/model-2.jpg", "/model-3.jpg", "/model-4.jpg", "/model-5.jpg"]

  const getProfileImages = (profile: Profile, index: number) => {
    if (profile.photos && profile.photos.length > 0) {
      return profile.photos
    }
    return [modelImages[index % modelImages.length]]
  }

  const currentImages = currentProfile ? getProfileImages(currentProfile, currentIndex) : []
  const currentPhoto = currentImages[photoIndex] || "/model-1.jpg"

  const handleSwipe = async (direction: "like" | "pass") => {
    if (!currentProfile) return

    try {
      const supabase = createClient()

      await supabase.from("swipes").insert({
        user_id: userId,
        target_user_id: currentProfile.id,
        action: direction,
        created_at: new Date().toISOString(),
      })

      if (direction === "like") {
        const { data: mutualSwipe } = await supabase
          .from("swipes")
          .select("*")
          .eq("user_id", currentProfile.id)
          .eq("target_user_id", userId)
          .eq("action", "like")
          .single()

        if (mutualSwipe) {
          await supabase.from("matches").insert({
            user1_id: userId,
            user2_id: currentProfile.id,
            matched_at: new Date().toISOString(),
          })

          toast({
            title: "It's a Match!",
            description: `You and ${currentProfile.full_name} liked each other!`,
          })
        }
      }

      setCurrentIndex((prev) => prev + 1)
      setPhotoIndex(0)
      setDragOffset({ x: 0, y: 0 })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record swipe",
        variant: "destructive",
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setDragOffset({ x: e.movementX + dragOffset.x, y: e.movementY + dragOffset.y })
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    if (Math.abs(dragOffset.x) > 100) {
      handleSwipe(dragOffset.x > 0 ? "like" : "pass")
    } else {
      setDragOffset({ x: 0, y: 0 })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return
    const touch = e.touches[0]
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    setDragOffset({
      x: touch.clientX - rect.left - rect.width / 2,
      y: touch.clientY - rect.top - rect.height / 2,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    if (Math.abs(dragOffset.x) > 100) {
      handleSwipe(dragOffset.x > 0 ? "like" : "pass")
    } else {
      setDragOffset({ x: 0, y: 0 })
    }
  }

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPhotoIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1))
  }

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPhotoIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1))
  }

  if (!currentProfile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-12 text-center">
          <p className="text-lg text-muted-foreground">No more profiles to show</p>
          <p className="text-sm text-muted-foreground mt-2">Check back later for new matches!</p>
        </CardContent>
      </Card>
    )
  }

  const rotation = dragOffset.x * 0.1
  const opacity = 1 - Math.abs(dragOffset.x) / 300

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px]">
      {/* Card Stack */}
      <div className="relative w-full h-full">
        {/* Next card preview */}
        {profiles[currentIndex + 1] && (
          <Card className="absolute inset-0 scale-95 opacity-50 pointer-events-none">
            <CardContent className="p-0 h-full">
              <div className="relative h-full rounded-lg overflow-hidden">
                <img
                  src={getProfileImages(profiles[currentIndex + 1], currentIndex + 1)[0] || "/placeholder.svg"}
                  alt={profiles[currentIndex + 1].full_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current card with photo slider */}
        <Card
          ref={cardRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing transition-transform"
          style={{
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
            opacity,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <CardContent className="p-0 h-full">
            <div className="relative h-full rounded-lg overflow-hidden">
              {/* Photo with slide view */}
              <img
                src={currentPhoto || "/placeholder.svg"}
                alt={currentProfile.full_name}
                className="w-full h-full object-cover"
              />

              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Photo indicators */}
                  <div className="absolute top-2 left-0 right-0 flex gap-1 px-2">
                    {currentImages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          idx === photoIndex ? "bg-white" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Swipe indicators */}
              {dragOffset.x > 50 && (
                <div className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-2xl rotate-12">
                  LIKE
                </div>
              )}
              {dragOffset.x < -50 && (
                <div className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-2xl -rotate-12">
                  PASS
                </div>
              )}

              {/* Profile info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      {currentProfile.full_name}
                      {currentProfile.age && <span className="text-xl ml-2">{currentProfile.age}</span>}
                    </h2>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      <Info className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {currentProfile.city}, {currentProfile.country}
                    </span>
                    {currentProfile.distance && <span>• {currentProfile.distance}km away</span>}
                  </div>

                  {showDetails && (
                    <div className="space-y-3 pt-4 animate-in slide-in-from-bottom">
                      {currentProfile.bio && <p className="text-sm">{currentProfile.bio}</p>}

                      {currentProfile.occupation && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4" />
                          <span>{currentProfile.occupation}</span>
                        </div>
                      )}

                      {currentProfile.education && (
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="h-4 w-4" />
                          <span>{currentProfile.education}</span>
                        </div>
                      )}

                      {currentProfile.interests && currentProfile.interests.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {currentProfile.interests.map((interest) => (
                            <Badge
                              key={interest}
                              variant="secondary"
                              className="bg-white/20 text-white border-white/30"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="absolute -bottom-20 left-0 right-0 flex items-center justify-center gap-6">
        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
          onClick={() => handleSwipe("pass")}
        >
          <X className="h-8 w-8" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-20 w-20 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white bg-transparent"
        >
          <Star className="h-10 w-10" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white bg-transparent"
          onClick={() => handleSwipe("like")}
        >
          <Heart className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )
}
