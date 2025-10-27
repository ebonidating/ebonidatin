"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, RefreshCw } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Error occurred:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
          <Heart className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-8">
          We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
        </p>
        <Button size="lg" onClick={reset} className="bg-cyan-600 hover:bg-cyan-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
