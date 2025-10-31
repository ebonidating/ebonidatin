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
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        setStatus("error")
        setMessage("Failed to get session. Please try again.")
        return
      }

      if (session) {
        const { data: user, error: userError } = await supabase.auth.getUser()

        if (userError) {
          setStatus("error")
          setMessage("Failed to get user. Please try again.")
          return
        }
        
        if (user) {
          const { error: profileError } = await supabase.from("profiles").update({ email_verified: true }).eq("id", user.user.id)

          if (profileError) {
            setStatus("error")
            setMessage("Failed to verify email. Please try again.")
            return
          }

          setStatus("success")
          setMessage("Email verified successfully! Redirecting to dashboard...")

          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("User not found.")
        }
      } else {
        setStatus("error")
        setMessage("No active session found. Please log in.")
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
            Email Verification
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        {status === "error" && (
          <CardContent className="space-y-2">
            <Button onClick={() => router.push("/auth/sign-up")} className="w-full bg-amber-600 hover:bg-amber-700">
              Sign Up Again
            </Button>
            <Button onClick={() => router.push("/auth/login")} variant="outline" className="w-full">
              Go to Login
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
