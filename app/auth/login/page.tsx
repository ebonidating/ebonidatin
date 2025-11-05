"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { TurnstileWidget } from "@/components/turnstile-widget"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus()
    }
  }, [error])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Verify Turnstile token
      if (!turnstileToken) {
        throw new Error("Please complete the security verification.")
      }

      const verifyResponse = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyData.success) {
        throw new Error("Security verification failed. Please try again.")
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("email_verified")
          .eq("id", data.user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 means no rows found, which we can handle.
          // Any other error should be thrown.
          throw profileError
        }

        if (profile && !profile.email_verified) {
          await supabase.auth.signOut()
          setError("Please verify your email before logging in. Check your inbox for the verification link.")
          setIsLoading(false)
          return
        }
      }

      // Instead of router.push, we do a full page refresh to the dashboard.
      // This allows the server-side logic in the dashboard page to correctly
      // handle the user's authentication state and redirect to onboarding if necessary.
      window.location.href = '/dashboard'

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google")
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <img src="/eboni-logo.png" alt="Eboni Dating" className="h-8 w-8" />
            <span className="text-2xl font-bold text-gray-900">Eboni Dating</span>
          </Link>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account to continue your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-2 hover:bg-gray-50 bg-transparent"
                  onClick={handleGoogleLogin}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                  Sign in with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLogin} aria-busy={isLoading}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Cloudflare Turnstile */}
                  <div className="flex justify-center">
                    <TurnstileWidget
                      onSuccess={(token) => setTurnstileToken(token)}
                      onError={() => setError("Security verification failed. Please refresh the page.")}
                    />
                  </div>
                  
                  {error && (
                    <div ref={errorRef} tabIndex={-1}>
                      <Alert variant="destructive" aria-live="polite">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading || !turnstileToken}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="text-amber-600 hover:text-amber-700 underline underline-offset-4 font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
