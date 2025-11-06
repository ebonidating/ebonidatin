"use client"

import { Turnstile } from "@marsidev/react-turnstile"
import { useEffect, useState } from "react"

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void
  onError?: () => void
}

export function TurnstileWidget({ onSuccess, onError }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!siteKey) {
    console.error("Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY")
    return null
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-16">
        <div className="text-sm text-gray-500">Loading verification...</div>
      </div>
    )
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={(error) => {
        console.error("Turnstile error:", error)
        if (onError) onError()
      }}
      onExpire={() => {
        console.log("Turnstile expired")
      }}
      options={{
        theme: "light",
        size: "normal",
        action: "signup",
        cData: typeof window !== "undefined" ? window.location.hostname : "",
      }}
    />
  )
}
