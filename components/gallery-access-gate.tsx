"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Zap } from "lucide-react"
import Link from "next/link"

interface GalleryAccessGateProps {
  userId: string
  children: React.ReactNode
}

export function GalleryAccessGate({ userId, children }: GalleryAccessGateProps) {
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tier, setTier] = useState<string>("free")

  useEffect(() => {
    checkGalleryAccess()
  }, [userId])

  const checkGalleryAccess = async () => {
    try {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier, gallery_access")
        .eq("id", userId)
        .single()

      if (profile) {
        setTier(profile.subscription_tier)
        setHasAccess(profile.gallery_access && profile.subscription_tier !== "free")
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />
  }

  if (!hasAccess) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-600" />
            <CardTitle>Gallery Access Required</CardTitle>
          </div>
          <CardDescription>Upgrade your membership to view the gallery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-amber-900">
            Gallery access is available for Premium, VIP, and Model Pro members. Upgrade now to see exclusive photos and
            videos.
          </p>
          <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
            <Link href="/membership">
              <Zap className="h-4 w-4 mr-2" />
              Upgrade Membership
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
