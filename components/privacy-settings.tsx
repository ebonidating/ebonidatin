"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface PrivacySettingsProps {
  userId: string
  currentSettings?: {
    incognito_mode: boolean
    show_online_status: boolean
    show_distance: boolean
    show_last_active: boolean
    profile_visibility: string
  }
}

export function PrivacySettings({ userId, currentSettings }: PrivacySettingsProps) {
  const [incognitoMode, setIncognitoMode] = useState(currentSettings?.incognito_mode || false)
  const [showOnlineStatus, setShowOnlineStatus] = useState(currentSettings?.show_online_status ?? true)
  const [showDistance, setShowDistance] = useState(currentSettings?.show_distance ?? true)
  const [showLastActive, setShowLastActive] = useState(currentSettings?.show_last_active ?? true)
  const [profileVisibility, setProfileVisibility] = useState(currentSettings?.profile_visibility || "everyone")
  const [reportReason, setReportReason] = useState("")
  const [reportDetails, setReportDetails] = useState("")
  const { toast } = useToast()

  const saveSettings = async () => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("profiles")
        .update({
          incognito_mode: incognitoMode,
          show_online_status: showOnlineStatus,
          show_distance: showDistance,
          show_last_active: showLastActive,
          profile_visibility: profileVisibility,
        })
        .eq("id", userId)

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Your privacy settings have been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    }
  }

  const handleReport = async (reportedUserId: string) => {
    if (!reportReason || !reportDetails) {
      toast({
        title: "Error",
        description: "Please provide a reason and details",
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = createClient()

      await supabase.from("reports").insert({
        reporter_id: userId,
        reported_user_id: reportedUserId,
        reason: reportReason,
        details: reportDetails,
        created_at: new Date().toISOString(),
        status: "pending",
      })

      setReportReason("")
      setReportDetails("")

      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      })
    }
  }

  const handleBlock = async (blockedUserId: string) => {
    try {
      const supabase = createClient()

      await supabase.from("blocked_users").insert({
        blocker_id: userId,
        blocked_id: blockedUserId,
        blocked_at: new Date().toISOString(),
      })

      toast({
        title: "User blocked",
        description: "You won't see this user anymore",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block user",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            <CardTitle>Privacy Settings</CardTitle>
          </div>
          <CardDescription>Control who can see your profile and activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Incognito Mode</Label>
              <p className="text-sm text-muted-foreground">Browse profiles without being seen</p>
            </div>
            <Switch checked={incognitoMode} onCheckedChange={setIncognitoMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Online Status</Label>
              <p className="text-sm text-muted-foreground">Let others see when you're online</p>
            </div>
            <Switch checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Distance</Label>
              <p className="text-sm text-muted-foreground">Display your distance from other users</p>
            </div>
            <Switch checked={showDistance} onCheckedChange={setShowDistance} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Last Active</Label>
              <p className="text-sm text-muted-foreground">Display when you were last active</p>
            </div>
            <Switch checked={showLastActive} onCheckedChange={setShowLastActive} />
          </div>

          <div className="space-y-2">
            <Label>Profile Visibility</Label>
            <Select value={profileVisibility} onValueChange={setProfileVisibility}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="matches">Matches Only</SelectItem>
                <SelectItem value="premium">Premium Members Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={saveSettings} className="w-full bg-amber-600 hover:bg-amber-700">
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle>Safety & Reporting</CardTitle>
          </div>
          <CardDescription>Report inappropriate behavior or block users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium mb-2">Safety Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Never share personal information like your address or financial details</li>
              <li>Meet in public places for first dates</li>
              <li>Tell a friend or family member about your plans</li>
              <li>Trust your instincts - if something feels wrong, it probably is</li>
              <li>Report any suspicious or inappropriate behavior immediately</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label>Report Reason</Label>
            <Select value={reportReason} onValueChange={setReportReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="fake">Fake Profile</SelectItem>
                <SelectItem value="scam">Scam or Fraud</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Details</Label>
            <Textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Please provide details about the issue..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
