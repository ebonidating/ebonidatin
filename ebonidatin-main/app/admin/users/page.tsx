import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

export default async function AdminUsersPage() {
  await checkAdminAccess()

  const supabase = await createClient()

  // Fetch all users with their profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

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
              <span className="text-xl font-bold">User Management</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Users</h1>
          <p className="text-gray-600">Total: {profiles?.length || 0} users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profiles && profiles.length > 0 ? (
                profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{profile.full_name || "No name"}</div>
                      <div className="text-sm text-gray-500">
                        {profile.age} years old • {profile.location || "No location"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Joined: {new Date(profile.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={profile.bio ? "default" : "secondary"}>
                        {profile.bio ? "Complete" : "Incomplete"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No users found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
