"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, Star, Heart, Award, Sparkles, Crown, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ProfileCustomizationProps {
  userId: string
  currentCoverPhoto?: string
  currentBadges?: string[]
}

const availableBadges = [
  { id: "verified", name: "Verified", icon: Star, color: "bg-blue-500" },
  { id: "popular", name: "Popular", icon: Heart, color: "bg-pink-500" },
  { id: "premium", name: "Premium", icon: Crown, color: "bg-yellow-500" },
  { id: "active", name: "Active", icon: Zap, color: "bg-green-500" },
  { id: "featured", name: "Featured", icon: Sparkles, color: "bg-purple-500" },
  { id: "top-rated", name: "Top Rated", icon: Award, color: "bg-orange-500" },
]

const stickerPacks = [
  { id: "hearts", emoji: "❤️", name: "Hearts" },
  { id: "stars", emoji: "⭐", name: "Stars" },
  { id: "fire", emoji: "🔥", name: "Fire" },
  { id: "sparkles", emoji: "✨", name: "Sparkles" },
  { id: "crown", emoji: "👑", name: "Crown" },
  { id: "rose", emoji: "🌹", name: "Rose" },
]

export function ProfileCustomization({ userId, currentCoverPhoto, currentBadges = [] }: ProfileCustomizationProps) {
  const [coverPhoto, setCoverPhoto] = useState(currentCoverPhoto)
  const [selectedBadges, setSelectedBadges] = useState<string[]>(currentBadges)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const supabase = createClient()

      // Upload to Vercel Blob
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { url } = await response.json()

      // Update profile
      const { error } = await supabase.from("profiles").update({ cover_photo: url }).eq("id", userId)

      if (error) throw error

      setCoverPhoto(url)
      toast({
        title: "Success",
        description: "Cover photo updated successfully",
      })
    } catch (error) {
      console.error("[v0] Cover photo upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload cover photo",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const toggleBadge = async (badgeId: string) => {
    const newBadges = selectedBadges.includes(badgeId)
      ? selectedBadges.filter((b) => b !== badgeId)
      : [...selectedBadges, badgeId]

    try {
      const supabase = createClient()
      const { error } = await supabase.from("profiles").update({ badges: newBadges }).eq("id", userId)

      if (error) throw error

      setSelectedBadges(newBadges)
      toast({
        title: "Success",
        description: "Badges updated successfully",
      })
    } catch (error) {
      console.error("[v0] Badge update error:", error)
      toast({
        title: "Error",
        description: "Failed to update badges",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Profile</CardTitle>
        <CardDescription>Make your profile stand out with cover photos, badges, and stickers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cover">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cover">Cover Photo</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="stickers">Stickers</TabsTrigger>
          </TabsList>

          <TabsContent value="cover" className="space-y-4">
            <div className="space-y-4">
              <div className="relative aspect-[3/1] bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg overflow-hidden">
                {coverPhoto ? (
                  <img src={coverPhoto || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover-upload">Upload Cover Photo</Label>
                <div className="flex gap-2">
                  <Input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverPhotoUpload}
                    disabled={uploading}
                  />
                  <Button disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableBadges.map((badge) => {
                const Icon = badge.icon
                const isSelected = selectedBadges.includes(badge.id)

                return (
                  <button
                    key={badge.id}
                    onClick={() => toggleBadge(badge.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`p-3 rounded-full ${badge.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium">{badge.name}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">Selected badges will appear on your profile</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedBadges.map((badgeId) => {
                  const badge = availableBadges.find((b) => b.id === badgeId)
                  if (!badge) return null
                  const Icon = badge.icon
                  return (
                    <Badge key={badgeId} className={badge.color}>
                      <Icon className="h-3 w-3 mr-1" />
                      {badge.name}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stickers" className="space-y-4">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {stickerPacks.map((sticker) => (
                <button
                  key={sticker.id}
                  className="p-4 rounded-lg border-2 border-border hover:border-primary transition-all hover:scale-110"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">{sticker.emoji}</span>
                    <span className="text-xs font-medium">{sticker.name}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Stickers can be used in messages and on your profile to express yourself
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
