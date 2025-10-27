"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Search, Loader2 } from "lucide-react"
import Link from "next/link"

interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
  city: string | null
  country: string | null
  user_type: string | null
}

export function UserList() {
  const [users, setUsers] = useState<Profile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter((user) => {
        const name = user.display_name || user.full_name || ""
        const location = `${user.city || ""} ${user.country || ""}`
        return (
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, display_name, city, country, user_type")
        .neq("id", user.id)
        .eq("email_verified", true)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      setUsers(data || [])
      setFilteredUsers(data || [])
    } catch (err) {
      console.error("[v0] Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-cyan-100 text-cyan-600">
                        {getInitials(user.display_name || user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.display_name || user.full_name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.city && user.country
                          ? `${user.city}, ${user.country}`
                          : user.country || "Location not set"}
                      </p>
                      {user.user_type === "model" && (
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Model</span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/messages/chat?user=${user.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
