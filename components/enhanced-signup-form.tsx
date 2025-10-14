"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCountries, getCitiesByCountry } from "@/lib/countries-data"
import { Loader2, Mail } from "lucide-react"

export function EnhancedSignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [userType, setUserType] = useState<"user" | "model">("user")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const countries = getCountries()
  const cities = country ? getCitiesByCountry(country) : []

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation
    if (!email || !password || !fullName || !phone || !country || !city) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    if (!termsAccepted) {
      setError("You must accept the terms and conditions")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone,
            country,
            city,
            user_type: userType,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile with additional information
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName,
          phone,
          country,
          city,
          user_type: userType,
          email_verified: false,
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
        })

        if (profileError) {
          console.error("[v0] Profile creation error:", profileError)
          throw new Error("Failed to create profile. Please try again.")
        }

        setSuccess(true)
      }
    } catch (err: any) {
      console.error("[v0] Signup error:", err)
      setError(err.message || "An error occurred during sign up. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-amber-600" />
            <CardTitle>Check Your Email</CardTitle>
          </div>
          <CardDescription>We've sent a verification link to {email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-900">
              <strong>Important:</strong> Please check your email inbox (and spam folder) for a verification link from
              Eboni Dating. You must verify your email before you can log in.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>The verification link will expire in 24 hours.</p>
            <p>
              Didn't receive the email?{" "}
              <button onClick={() => setSuccess(false)} className="text-amber-600 hover:underline font-medium">
                Try signing up again
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>Join the Eboni Dating community today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">Account Type *</Label>
              <Select value={userType} onValueChange={(value: "user" | "model") => setUserType(value)}>
                <SelectTrigger id="userType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Regular User</SelectItem>
                  <SelectItem value="model">Model</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={country}
                onValueChange={(value) => {
                  setCountry(value)
                  setCity("") // Reset city when country changes
                }}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select value={city} onValueChange={setCity} disabled={!country}>
                <SelectTrigger id="city">
                  <SelectValue placeholder={country ? "Select city" : "Select country first"} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                I agree to the Terms and Conditions and Privacy Policy. I understand that I must be 18 years or older to
                use this service. I consent to receive communications and understand that my information will be
                processed according to the privacy policy.
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <a href="/auth/login" className="text-amber-600 hover:underline font-medium">
              Log in
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
