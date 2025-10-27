"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Profile {
  id: string
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
}

interface ProfileEditFormProps {
  profile: Profile
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    display_name: profile.display_name || "",
    date_of_birth: profile.date_of_birth || "",
    gender: profile.gender || "",
    bio: profile.bio || "",
    city: profile.city || "",
    state: profile.state || "",
    country: profile.country || "",
    looking_for: profile.looking_for || "",
    interests: profile.interests || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          display_name: formData.display_name,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          bio: formData.bio,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          looking_for: formData.looking_for,
          interests: formData.interests,
        })
        .eq("id", profile.id)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const genderOptions = ["Male", "Female", "Non-binary", "Transgender", "Genderqueer", "Prefer not to say", "Other"]

  const lookingForOptions = [
    "Long-term relationship",
    "Short-term relationship",
    "Friendship",
    "Casual dating",
    "Not sure yet",
  ]

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
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Profile</h1>
          <p className="text-muted-foreground mb-8">Update your information to help others get to know you better</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where you're based</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* About You */}
            <Card>
              <CardHeader>
                <CardTitle>About You</CardTitle>
                <CardDescription>Tell others about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="looking_for">What are you looking for?</Label>
                  <Select
                    value={formData.looking_for}
                    onValueChange={(value) => setFormData({ ...formData, looking_for: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select what you're looking for" />
                    </SelectTrigger>
                    <SelectContent>
                      {lookingForOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={5}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="interests">Interests (comma-separated)</Label>
                  <Input
                    id="interests"
                    value={formData.interests.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        interests: e.target.value
                          .split(",")
                          .map((i) => i.trim())
                          .filter((i) => i),
                      })
                    }
                    placeholder="e.g., Music, Travel, Cooking, Fitness"
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                Profile updated successfully! Redirecting...
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push("/dashboard")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
