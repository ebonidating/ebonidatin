"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface SubscriptionGateProps {
  feature: string
  requiredTier?: "premium" | "vip" | "model_pro"
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SubscriptionGate({ feature, requiredTier = "premium", children, fallback }: SubscriptionGateProps) {
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch("/api/check-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feature }),
        })
        const data = await response.json()
        setHasAccess(data.hasAccess)
      } catch (error) {
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [feature])

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded-lg" />
  }

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Card className="border-2 border-amber-200 bg-amber-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-amber-600" />
          <CardTitle>Premium Feature</CardTitle>
        </div>
        <CardDescription>Upgrade to access this feature</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          This feature is available with{" "}
          {requiredTier === "model_pro" ? "Model Pro" : requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}{" "}
          membership.
        </p>
        <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => router.push("/pricing")}>
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  )
}
