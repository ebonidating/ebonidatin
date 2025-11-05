"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User, Eye, EyeOff, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { Country, City } from "country-state-city"
import PhoneInput from "react-phone-number-input"
import { TurnstileWidget } from "@/components/turnstile-widget"


export function EnhancedSignupForm() {
  const router = useRouter()
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    country: "",
    city: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [cities, setCities] = useState<any[]>([])

  const countries = Country.getAllCountries()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleCountryChange = (value: string) => {
    setFormData({ ...formData, country: value, city: "" })
    const country = countries.find(c => c.name === value)
    if (country) {
      const countryCities = City.getCitiesOfCountry(country.isoCode) || []
      setCities(countryCities)
    }
    setError(null)
  }

  const validateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age >= 18
  }

  const validateForm = () => {
    const { fullName, email, password, dateOfBirth, gender, phone, country, city } = formData

    if (!fullName || !email || !password || !dateOfBirth || !gender || !phone || !country || !city) {
      setError("All fields are required")
      return false
    }

    if (fullName.trim().length < 2) {
      setError("Please enter your full name")
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }

    if (!validateAge(dateOfBirth)) {
      setError("You must be at least 18 years old to register")
      return false
    }

    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number")
      return false
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError("Password must contain uppercase, lowercase, and numbers")
      return false
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions")
      return false
    }

    return true
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    // Verify Turnstile token
    if (!turnstileToken) {
      setError("Please complete the security verification")
      setLoading(false)
      return
    }

    try {
      // Verify Turnstile token
      const verifyResponse = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyData.success) {
        throw new Error("Security verification failed. Please try again.")
      }

      const supabase = createClient()
      const redirectUrl = `${window.location.origin}/auth/callback`

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: formData.fullName,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
            phone: formData.phone,
            country: formData.country,
            city: formData.city,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          subscription_tier: "free",
          email_verified: false,
          created_at: new Date().toISOString(),
        })

        if (profileError && !profileError.message.includes("duplicate")) {
          console.error("Profile creation error:", profileError)
        }

        // Check if email confirmation is required
        if (authData.session) {
          // Auto-logged in, redirect to onboarding
          router.push("/onboarding")
        } else {
          // Email confirmation required
          setSuccess(true)
        }
      }
    } catch (err: any) {
      console.error("Signup error:", err)
      
      if (err.message?.includes("already registered") || err.message?.includes("User already registered")) {
        setError("This email is already registered. Please sign in instead.")
      } else if (err.message?.includes("rate limit")) {
        setError("Too many attempts. Please try again in a few minutes.")
      } else {
        setError(err.message || "Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      })
      
      if (error) throw error
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification link to <strong>{formData.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-900">
              Click the link in your email to verify your account and complete registration.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground text-center space-y-2">
            <p>Didn't receive the email? Check your spam folder.</p>
            <Button
              variant="link"
              onClick={() => {
                setSuccess(false)
                setFormData({ fullName: "", email: "", password: "", dateOfBirth: "", gender: "", phone: "", country: "", city: "" })
              }}
              className="text-amber-600 p-0 h-auto"
            >
              Try a different email
            </Button>
          </div>
          <div className="pt-4 border-t">
            <Link href="/auth/login" className="block">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center text-base">
          Join thousands of singles finding love worldwide
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Must be 18 or older</p>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                disabled={loading}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-Binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phone */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <PhoneInput
                international
                defaultCountry="US"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value || "" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Include country code</p>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.country}
                onValueChange={handleCountryChange}
                disabled={loading}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countries.map((country) => (
                    <SelectItem key={country.isoCode} value={country.name}>
                      {country.flag} {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => setFormData({ ...formData, city: value })}
                disabled={loading || !formData.country}
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder={formData.country ? "Select city" : "Select country first"} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {cities.length > 0 ? (
                    cities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="other" disabled>No cities available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must contain uppercase, lowercase, and numbers (minimum 8 characters)
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2 pt-4">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              disabled={loading}
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
              I agree to the{" "}
              <Link href="/terms" className="text-amber-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-amber-600 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Cloudflare Turnstile */}
          <div className="flex justify-center my-4">
            <TurnstileWidget
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setError("Security verification failed. Please refresh the page.")}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full h-12 text-base bg-amber-600 hover:bg-amber-700" disabled={loading || !turnstileToken}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-amber-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
