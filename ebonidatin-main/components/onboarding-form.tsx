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
import { Heart, User, MapPin, Target } from "lucide-react"

interface OnboardingFormProps {
  userId: string
  userEmail: string
}

export default function OnboardingForm({ userId, userEmail }: OnboardingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    display_name: "",
    date_of_birth: "",
    gender: "",
    interested_in: [] as string[],
    bio: "",
    city: "",
    state: "",
    country: "",
    looking_for: "",
    interests: [] as string[],
  })

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("profiles").insert({
        id: userId,
        email: userEmail,
        full_name: formData.full_name,
        display_name: formData.display_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        interested_in: formData.interested_in,
        bio: formData.bio,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        looking_for: formData.looking_for,
        interests: formData.interests,
        is_active: true,
      })

      if (error) throw error

      router.push("/dashboard")
      router.refresh()
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
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-10 w-10 text-cyan-600 fill-cyan-600" />
          <span className="text-3xl font-bold text-gray-900">Eboni Dating</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
        <p className="text-muted-foreground">Step {step} of 3 - Let&apos;s get to know you better</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-600 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-cyan-600" />
            </div>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="How you want to be called"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
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

            <Button
              onClick={() => setStep(2)}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
              disabled={!formData.full_name || !formData.display_name || !formData.date_of_birth || !formData.gender}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Location & Preferences */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-cyan-600" />
            </div>
            <CardTitle>Location & Preferences</CardTitle>
            <CardDescription>Where are you and what are you looking for?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Your city"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Your state or province"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Your country"
                required
              />
            </div>

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

            <div className="flex gap-2">
              <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                disabled={!formData.city || !formData.country || !formData.looking_for}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: About You */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-cyan-600" />
            </div>
            <CardTitle>About You</CardTitle>
            <CardDescription>Share a bit about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell others about yourself, your interests, and what makes you unique..."
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

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setStep(2)} variant="outline" className="w-full" disabled={isLoading}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                disabled={isLoading || !formData.bio}
              >
                {isLoading ? "Creating Profile..." : "Complete Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
