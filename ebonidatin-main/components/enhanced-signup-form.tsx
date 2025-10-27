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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const countries = getCountries()
  const cities = country ? getCitiesByCountry(country) : []

  const handleGoogleSignUp = async () => {
    const supabase = createClient()
    setIsGoogleLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to sign up with Google")
      setIsGoogleLoading(false)
    }
  }

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

          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGoogleSignUp}
              disabled={loading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign up with Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
          </div>

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

          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={loading || isGoogleLoading}
          >
            {loading || isGoogleLoading ? (
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
