"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Heart, User, MapPin, Target, X, Plus } from "lucide-react"
import Image from "next/image"

interface SinglePageOnboardingProps {
  userId: string
  userEmail: string
}

export default function SinglePageOnboarding({ userId, userEmail }: SinglePageOnboardingProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [customInterest, setCustomInterest] = useState("")

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    bio: "",
    city: "",
    country: "",
    looking_for: "",
    relationship_goals: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const popularInterests = [
    "Travel", "Music", "Movies", "Reading", "Fitness", "Cooking",
    "Photography", "Art", "Dancing", "Sports", "Gaming", "Yoga",
    "Fashion", "Food", "Technology", "Nature", "Pets", "Wine"
  ]

  const addInterest = (interest: string) => {
    if (!selectedInterests.includes(interest) && selectedInterests.length < 10) {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest))
  }

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim()) && selectedInterests.length < 10) {
      setSelectedInterests([...selectedInterests, customInterest.trim()])
      setCustomInterest("")
    }
  }

  const validateForm = () => {
    const { full_name, date_of_birth, gender, bio, city, country, looking_for } = formData

    if (!full_name || !date_of_birth || !gender || !bio || !city || !country || !looking_for) {
      setError("Please fill in all required fields")
      return false
    }

    if (full_name.trim().length < 2) {
      setError("Please enter your full name")
      return false
    }

    if (bio.trim().length < 20) {
      setError("Bio must be at least 20 characters")
      return false
    }

    if (selectedInterests.length < 3) {
      setError("Please select at least 3 interests")
      return false
    }

    // Validate age
    const birthDate = new Date(date_of_birth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    if (age < 18) {
      setError("You must be at least 18 years old")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      // Update the profile (created by trigger on signup)
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          bio: formData.bio,
          city: formData.city,
          country: formData.country,
          looking_for: formData.looking_for,
          relationship_goals: formData.relationship_goals,
          interests: selectedInterests,
          profile_completion: 70, // Profile is 70% complete
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) throw error

      // Redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      console.error("Profile update error:", err)
      setError(err.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const genderOptions = ["male", "female", "non-binary", "other"]
  const lookingForOptions = [
    "Long-term relationship",
    "Short-term relationship",
    "Friendship",
    "Casual dating",
    "Not sure yet"
  ]
  const relationshipGoalsOptions = [
    "Marriage",
    "Life partner",
    "Dating",
    "Friends first",
    "Keep it casual"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Tell us about yourself to find your perfect match
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Let's get to know you</CardTitle>
            <CardDescription>
              All fields are required. This helps us find compatible matches for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-2">
                  <User className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      disabled={isLoading}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Must be 18 or older</p>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold">Location</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      placeholder="e.g., United States"
                      value={formData.country}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="e.g., New York"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* About You */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Heart className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold">About You</h3>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself... What makes you unique? What are you passionate about?"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={5}
                    className="resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.bio.length}/500 characters (minimum 20)
                  </p>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Target className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold">Interests</h3>
                </div>

                {/* Selected Interests */}
                {selectedInterests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="px-3 py-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="ml-2 hover:text-amber-900"
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Popular Interests */}
                <div className="space-y-3">
                  <Label>Select at least 3 interests *</Label>
                  <div className="flex flex-wrap gap-2">
                    {popularInterests.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (selectedInterests.includes(interest)) {
                            removeInterest(interest)
                          } else {
                            addInterest(interest)
                          }
                        }}
                        disabled={isLoading || (selectedInterests.length >= 10 && !selectedInterests.includes(interest))}
                        className={selectedInterests.includes(interest) ? "bg-amber-600 hover:bg-amber-700" : ""}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedInterests.length}/10 interests selected
                  </p>
                </div>

                {/* Custom Interest */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom interest..."
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCustomInterest()
                      }
                    }}
                    disabled={isLoading || selectedInterests.length >= 10}
                  />
                  <Button
                    type="button"
                    onClick={addCustomInterest}
                    disabled={isLoading || !customInterest.trim() || selectedInterests.length >= 10}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Relationship Preferences */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Heart className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold">Relationship Preferences</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Looking For */}
                  <div className="space-y-2">
                    <Label htmlFor="looking_for">Looking For *</Label>
                    <Select
                      value={formData.looking_for}
                      onValueChange={(value) => setFormData({ ...formData, looking_for: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="looking_for">
                        <SelectValue placeholder="What are you looking for?" />
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

                  {/* Relationship Goals */}
                  <div className="space-y-2">
                    <Label htmlFor="relationship_goals">Relationship Goals</Label>
                    <Select
                      value={formData.relationship_goals}
                      onValueChange={(value) => setFormData({ ...formData, relationship_goals: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="relationship_goals">
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipGoalsOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex flex-col gap-4 pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg bg-amber-600 hover:bg-amber-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Completing Profile...
                    </>
                  ) : (
                    "Complete Profile & Find Matches"
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  You can always update your profile later from your dashboard
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
