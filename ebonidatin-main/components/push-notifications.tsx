"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BellOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PushNotificationsProps {
  userId: string
}

export function PushNotifications({ userId }: PushNotificationsProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      setIsSupported(true)
      setIsSubscribed(Notification.permission === "granted")
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in your browser",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const permission = await Notification.requestPermission()

      if (permission === "granted") {
        setIsSubscribed(true)

        // Register service worker and get push subscription
        const registration = await navigator.serviceWorker.register("/sw.js")
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        })

        // Send subscription to server
        await fetch("/api/push-subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            subscription,
          }),
        })

        toast({
          title: "Notifications Enabled",
          description: "You'll now receive notifications for new messages and matches",
        })
      } else {
        toast({
          title: "Permission Denied",
          description: "You can enable notifications in your browser settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Push notification error:", error)
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {isSubscribed ? <Bell className="h-5 w-5 text-green-600" /> : <BellOff className="h-5 w-5" />}
          <CardTitle>Push Notifications</CardTitle>
        </div>
        <CardDescription>
          {isSubscribed
            ? "You're receiving notifications for new messages and matches"
            : "Enable notifications to stay updated"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSubscribed && (
          <Button onClick={requestPermission} disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700">
            {loading ? "Enabling..." : "Enable Notifications"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
