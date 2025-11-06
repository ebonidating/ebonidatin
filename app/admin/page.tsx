import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, Heart, MessageCircle, Shield, Activity, AlertCircle, 
  DollarSign, Flag, Settings, BarChart3, UserCheck, UserX 
} from "lucide-react"

async function checkAdminAccess() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!adminUser || !adminUser.is_active) {
    redirect("/")
  }

  return { user, adminUser }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
  const { adminUser } = await checkAdminAccess()
  const supabase = await createClient()

  // Fetch statistics
  const [
    { count: totalUsers },
    { count: totalProfiles },
    { count: totalMatches },
    { count: totalMessages },
    { count: verifiedUsers },
    { count: pendingReports },
    { count: activeSubscriptions },
    { count: recentSignups },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).not("bio", "is", null),
    supabase.from("matches").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("verified", true),
    supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).in("subscription_tier", ["premium", "elite"]),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  const stats = [
    {
      title: "Total Users",
      value: totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/admin/users"
    },
    {
      title: "Complete Profiles",
      value: totalProfiles || 0,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/admin/users"
    },
    {
      title: "Verified Users",
      value: verifiedUsers || 0,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/admin/users?filter=verified"
    },
    {
      title: "Total Matches",
      value: totalMatches || 0,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      href: "/admin/reports"
    },
    {
      title: "Messages",
      value: totalMessages || 0,
      icon: MessageCircle,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      href: "/admin/reports"
    },
    {
      title: "Pending Reports",
      value: pendingReports || 0,
      icon: Flag,
      color: "text-red-600",
      bgColor: "bg-red-100",
      href: "/admin/reports"
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions || 0,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      href: "/admin/reports"
    },
    {
      title: "New Signups (7d)",
      value: recentSignups || 0,
      icon: Activity,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      href: "/admin/users?filter=recent"
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {adminUser.email} ({adminUser.role})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  View Site
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/users">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/reports">
                  <Flag className="w-4 h-4 mr-2" />
                  Review Reports ({pendingReports || 0} pending)
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/reports">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Platform Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Platform health and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Status</span>
                <span className="flex items-center text-green-600">
                  <Activity className="w-4 h-4 mr-1" />
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auth System</span>
                <span className="flex items-center text-green-600">
                  <Shield className="w-4 h-4 mr-1" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Reports</span>
                <span className="flex items-center text-amber-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {pendingReports || 0} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="flex items-center text-blue-600">
                  <Users className="w-4 h-4 mr-1" />
                  {totalUsers || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Permissions</CardTitle>
            <CardDescription>Your current access level: {adminUser.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {adminUser.permissions?.manage_users && (
                <div className="flex items-center gap-2 text-green-600">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-sm">Manage Users</span>
                </div>
              )}
              {adminUser.permissions?.manage_content && (
                <div className="flex items-center gap-2 text-green-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Manage Content</span>
                </div>
              )}
              {adminUser.permissions?.view_reports && (
                <div className="flex items-center gap-2 text-green-600">
                  <Flag className="w-4 h-4" />
                  <span className="text-sm">View Reports</span>
                </div>
              )}
              {adminUser.permissions?.manage_admins && (
                <div className="flex items-center gap-2 text-green-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Manage Admins</span>
                </div>
              )}
              {adminUser.permissions?.view_analytics && (
                <div className="flex items-center gap-2 text-green-600">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">View Analytics</span>
                </div>
              )}
              {adminUser.permissions?.delete_accounts && (
                <div className="flex items-center gap-2 text-green-600">
                  <UserX className="w-4 h-4" />
                  <span className="text-sm">Delete Accounts</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
