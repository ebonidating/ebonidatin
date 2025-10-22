"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Video, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  read: boolean
  created_at: string
}

interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
}

interface ChatInterfaceProps {
  currentUserId: string
  otherUserId: string
  otherUserProfile: Profile
  onVideoCall?: () => void
}

export function ChatInterface({ currentUserId, otherUserId, otherUserProfile, onVideoCall }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `sender_id=eq.${otherUserId},receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
          scrollToBottom()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, otherUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`,
        )
        .order("created_at", { ascending: true })

      if (error) throw error

      setMessages(data || [])
    } catch (err) {
      setError("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    setError(null)

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver_id: otherUserId,
          message: newMessage.trim(),
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const { message } = await response.json()
      setMessages((prev) => [...prev, message])
      setNewMessage("")
      scrollToBottom()
    } catch (err) {
      setError("Failed to send message")
    } finally {
      setSending(false)
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
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-cyan-100 text-cyan-600">
                {getInitials(otherUserProfile.display_name || otherUserProfile.full_name)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">
              {otherUserProfile.display_name || otherUserProfile.full_name || "User"}
            </CardTitle>
          </div>
          {onVideoCall && (
            <Button onClick={onVideoCall} size="sm" className="gap-2">
              <Video className="h-4 w-4" />
              Video Call
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {error && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</div>
            ) : (
              messages.map((msg) => {
                const isSender = msg.sender_id === currentUserId
                return (
                  <div key={msg.id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isSender ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${isSender ? "text-cyan-100" : "text-gray-500"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
            />
            <Button type="submit" disabled={sending || !newMessage.trim()} size="icon">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
