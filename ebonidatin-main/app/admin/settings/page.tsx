import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft, Settings } from "lucide-react"

async function checkAdminAccess() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("user_id", user.id).single()

  if (!adminUser) {
    redirect("/")
  }

  return { user, adminUser }
}

export default async function AdminSettingsPage() {
  await checkAdminAccess()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-cyan-600" />
              <span className="text-xl font-bold">Platform Settings</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure platform features and preferences</p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-cyan-600" />
                <CardTitle>General Settings</CardTitle>
              </div>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Email Verification</div>
                    <div className="text-sm text-gray-500">Require email verification for new users</div>
                  </div>
                  <Badge>Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Profile Moderation</div>
                    <div className="text-sm text-gray-500">Review profiles before they go live</div>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Maintenance Mode</div>
                    <div className="text-sm text-gray-500">Temporarily disable user access</div>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and privacy features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500">Require 2FA for admin accounts</div>
                  </div>
                  <Badge>Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Rate Limiting</div>
                    <div className="text-sm text-gray-500">Prevent abuse with rate limits</div>
                  </div>
                  <Badge>Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
