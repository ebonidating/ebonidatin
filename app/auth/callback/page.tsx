"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      
      // Get the session
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Session error:", error)
        setStatus("error")
        setMessage("Verification failed. Please try again.")
        return
      }

      if (!session) {
        setStatus("error")
        setMessage("No active session found. Please sign in.")
        return
      }

      try {
        // Get user data
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
          throw new Error("Failed to get user data")
        }

        // Check if profile exists
        const { data: profile, error: profileFetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileFetchError && profileFetchError.code !== "PGRST116") {
          console.error("Profile fetch error:", profileFetchError)
        }

        // Update or create profile with email_verified
        if (profile) {
          await supabase
            .from("profiles")
            .update({ email_verified: true })
            .eq("id", user.id)
        } else {
          // Create profile if it doesn't exist
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            subscription_tier: "free",
            email_verified: true,
            created_at: new Date().toISOString(),
          })
        }

        setStatus("success")
        setMessage("Email verified! Redirecting...")

        // Redirect based on profile completion
        setTimeout(() => {
          if (profile && profile.full_name && profile.country) {
            // Profile complete, go to dashboard
            router.push("/dashboard")
          } else {
            // Profile incomplete, go to onboarding
            router.push("/onboarding")
          }
        }, 1500)
      } catch (err) {
        console.error("Callback error:", err)
        setStatus("error")
        setMessage("Something went wrong. Please try signing in again.")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === "loading" && <Loader2 className="h-5 w-5 animate-spin text-amber-600" />}
            {status === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
            {status === "error" && <XCircle className="h-5 w-5 text-red-600" />}
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Success!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        {status === "error" && (
          <CardContent className="space-y-2">
            <Button onClick={() => router.push("/auth/login")} className="w-full bg-amber-600 hover:bg-amber-700">
              Go to Sign In
            </Button>
            <Button onClick={() => router.push("/auth/sign-up")} variant="outline" className="w-full">
              Create New Account
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
