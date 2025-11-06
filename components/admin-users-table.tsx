"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Ban,
  Trash2,
  Shield,
  Crown,
  Edit,
  Eye,
  Mail,
  AlertCircle,
  CheckCircle
} from "lucide-react"
interface AdminUsersTableProps {
  users: any[]
  currentPage: number
  totalPages: number
  totalUsers: number
}

export function AdminUsersTable({ users, currentPage, totalPages, totalUsers }: AdminUsersTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"view" | "edit" | "delete" | "ban" | "verify">("view")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (filter !== "all") params.set("filter", filter)
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleAction = (user: any, action: "view" | "edit" | "delete" | "ban" | "verify") => {
    setSelectedUser(user)
    setDialogType(action)
    setDialogOpen(true)
    setError(null)
    setSuccess(null)
  }

  const executeAction = async () => {
    if (!selectedUser) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    try {
      if (dialogType === "delete") {
        // Delete user account
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", selectedUser.id)

        if (error) throw error

        setSuccess("User account deleted successfully")
        setTimeout(() => {
          setDialogOpen(false)
          router.refresh()
        }, 1500)
      } else if (dialogType === "ban") {
        // Ban user
        const { error } = await supabase
          .from("profiles")
          .update({ 
            verified: false,
            online_status: "offline",
            updated_at: new Date().toISOString()
          })
          .eq("id", selectedUser.id)

        if (error) throw error

        setSuccess("User banned successfully")
        setTimeout(() => {
          setDialogOpen(false)
          router.refresh()
        }, 1500)
      } else if (dialogType === "verify") {
        // Verify user
        const { error } = await supabase
          .from("profiles")
          .update({ 
            verified: true,
            updated_at: new Date().toISOString()
          })
          .eq("id", selectedUser.id)

        if (error) throw error

        setSuccess("User verified successfully")
        setTimeout(() => {
          setDialogOpen(false)
          router.refresh()
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || "Action failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="max-w-md"
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              const params = new URLSearchParams()
              if (e.target.value !== "all") params.set("filter", e.target.value)
              if (searchTerm) params.set("search", searchTerm)
              router.push(`/admin/users?${params.toString()}`)
            }}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="premium">Premium</option>
            <option value="recent">Recent (7d)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {user.full_name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      <span className="font-medium">{user.full_name || "Unnamed"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {user.verified ? (
                        <Badge variant="secondary" className="w-fit bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="w-fit bg-gray-100 text-gray-800">
                          Unverified
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={`w-fit ${
                          user.online_status === "online"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.online_status || "offline"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${
                        user.subscription_tier === "elite"
                          ? "bg-purple-100 text-purple-800"
                          : user.subscription_tier === "premium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.subscription_tier === "elite" && <Crown className="w-3 h-3 mr-1" />}
                      {user.subscription_tier || "free"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleAction(user, "view")}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(user, "edit")}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {!user.verified && (
                          <DropdownMenuItem onClick={() => handleAction(user, "verify")}>
                            <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                            Verify User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleAction(user, "ban")}>
                          <Ban className="w-4 h-4 mr-2 text-amber-600" />
                          Ban User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleAction(user, "delete")}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, totalUsers)} of {totalUsers} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/users?page=${currentPage - 1}`)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/users?page=${currentPage + 1}`)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "view" && "User Details"}
              {dialogType === "edit" && "Edit User"}
              {dialogType === "delete" && "Delete User Account"}
              {dialogType === "ban" && "Ban User"}
              {dialogType === "verify" && "Verify User"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "view" && `Viewing details for ${selectedUser?.full_name}`}
              {dialogType === "edit" && `Edit profile for ${selectedUser?.full_name}`}
              {dialogType === "delete" &&
                "This action cannot be undone. All user data will be permanently deleted."}
              {dialogType === "ban" && `Ban ${selectedUser?.full_name} from the platform?`}
              {dialogType === "verify" && `Verify ${selectedUser?.full_name}'s account?`}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {dialogType === "view" && selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Full Name</p>
                  <p className="font-medium">{selectedUser.full_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Gender</p>
                  <p className="font-medium">{selectedUser.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-medium">
                    {selectedUser.city || selectedUser.country || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Subscription</p>
                  <p className="font-medium capitalize">{selectedUser.subscription_tier || "free"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Profile Completion</p>
                  <p className="font-medium">{selectedUser.profile_completion || 0}%</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            {dialogType !== "view" && dialogType !== "edit" && (
              <Button
                onClick={executeAction}
                disabled={loading}
                variant={dialogType === "delete" ? "destructive" : "default"}
              >
                {loading ? "Processing..." : "Confirm"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
