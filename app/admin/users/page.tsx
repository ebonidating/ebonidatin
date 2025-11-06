import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminUsersTable } from "@/components/admin-users-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function checkAdminAccess() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!adminUser || !adminUser.is_active || !adminUser.permissions?.manage_users) {
    redirect("/admin")
  }

  return { user, adminUser }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; filter?: string }
}) {
  await checkAdminAccess()
  const supabase = await createClient()

  const page = parseInt(searchParams.page || "1")
  const search = searchParams.search || ""
  const filter = searchParams.filter || "all"
  const perPage = 20

  // Build query
  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })

  // Apply search
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  // Apply filters
  if (filter === "verified") {
    query = query.eq("verified", true)
  } else if (filter === "unverified") {
    query = query.eq("verified", false)
  } else if (filter === "premium") {
    query = query.in("subscription_tier", ["premium", "elite"])
  } else if (filter === "recent") {
    query = query.gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  }

  // Fetch users with pagination
  const { data: users, count } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)

  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-600">Manage all user accounts</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Users ({count || 0})</CardTitle>
            <CardDescription>
              View, search, and manage user accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminUsersTable
              users={users || []}
              currentPage={page}
              totalPages={totalPages}
              totalUsers={count || 0}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
