import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft, AlertTriangle } from "lucide-react"
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

export default async function AdminReportsPage() {
  await checkAdminAccess()

  const supabase = await createClient()

  // Fetch all reports
  const { data: reports } = await supabase
    .from("reports")
    .select(
      `
      *,
      reporter:reporter_id(full_name),
      reported:reported_user_id(full_name)
    `,
    )
    .order("created_at", { ascending: false })

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
              <span className="text-xl font-bold">Content Moderation</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Reports</h1>
          <p className="text-gray-600">Review and moderate reported content</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports && reports.length > 0 ? (
                reports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="destructive">{report.reason}</Badge>
                        <div className="text-sm text-gray-600 mt-2">
                          Reported by: <span className="font-medium">{report.reporter?.full_name || "Unknown"}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Reported user: <span className="font-medium">{report.reported?.full_name || "Unknown"}</span>
                        </div>
                      </div>
                      <Badge variant={report.status === "pending" ? "secondary" : "default"}>{report.status}</Badge>
                    </div>
                    {report.description && (
                      <div className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded">
                        <span className="font-medium">Details:</span> {report.description}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-2">{new Date(report.created_at).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No reports found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
