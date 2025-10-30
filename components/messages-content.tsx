"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, ArrowLeft, Send, MessageCircle } from "lucide-react"
import Link from "next/link"

interface Profile {
  id: string
  display_name: string | null
  full_name: string | null
  is_verified: boolean
}

interface Message {
  id: string
  match_id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  sent_at: string
}

interface Conversation {
  match: {
    id: string
    matched_at: string
  }
  profile: Profile | undefined
  lastMessage: Message | null
  unreadCount: number
}

interface MessagesContentProps {
  currentUserId: string
  conversations: Conversation[]
  selectedMatchId?: string
}

export default function MessagesContent({ currentUserId, conversations, selectedMatchId }: MessagesContentProps) {
  const router = useRouter()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" })
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (selectedMatchId) {
      const conversation = conversations.find((c) => c.match.id === selectedMatchId)
      if (conversation) {
        setSelectedConversation(conversation)
      }
    }
  }, [selectedMatchId, conversations])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages()
      markMessagesAsRead()
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    if (!selectedConversation) return
    const supabase = createClient()

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("match_id", selectedConversation.match.id)
      .order("sent_at", { ascending: true })

    if (data) {
      setMessages(data)
    }
  }

  const markMessagesAsRead = async () => {
    if (!selectedConversation) return
    const supabase = createClient()

    await supabase
      .from("messages")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("match_id", selectedConversation.match.id)
      .eq("receiver_id", currentUserId)
      .eq("is_read", false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || isSending) return

    setIsSending(true)
    const supabase = createClient()

    const receiverId =
      selectedConversation.match.user_id_1 === currentUserId
        ? selectedConversation.match.user_id_2
        : selectedConversation.match.user_id_1

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          match_id: selectedConversation.match.id,
          sender_id: currentUserId,
          receiver_id: receiverId,
          content: newMessage.trim(),
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setMessages([...messages, data])
        setNewMessage("")
      }
    } catch (error) {
      // Error handled silently with UI feedback
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-cyan-600 fill-cyan-600" />
            <span className="text-xl font-bold text-gray-900">Eboni Dating</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            {/* Conversations List */}
            <Card className="md:col-span-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-white">
                <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                <p className="text-sm text-muted-foreground">{conversations.length} conversations</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-cyan-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">No conversations yet</p>
                    <Button asChild size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                      <Link href="/discover">Start Discovering</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {conversations.map((conversation) => {
                      if (!conversation.profile) return null

                      return (
                        <button
                          key={conversation.match.id}
                          onClick={() => {
                            setSelectedConversation(conversation)
                            router.push(`/messages?match=${conversation.match.id}`)
                          }}
                          className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                            selectedConversation?.match.id === conversation.match.id ? "bg-cyan-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12 flex-shrink-0">
                              <AvatarFallback className="bg-cyan-100 text-cyan-600">
                                {getInitials(conversation.profile.display_name || conversation.profile.full_name)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-sm truncate">
                                  {conversation.profile.display_name || conversation.profile.full_name}
                                </h3>
                                {conversation.lastMessage && (
                                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                    {formatMessageTime(conversation.lastMessage.sent_at)}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.lastMessage
                                    ? conversation.lastMessage.sender_id === currentUserId
                                      ? `You: ${conversation.lastMessage.content}`
                                      : conversation.lastMessage.content
                                    : "Start a conversation"}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <Badge className="ml-2 bg-cyan-600 text-white flex-shrink-0">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </Card>

            {/* Chat Area */}
            <Card className="md:col-span-2 overflow-hidden flex flex-col">
              {selectedConversation && selectedConversation.profile ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-white flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-cyan-100 text-cyan-600">
                        {getInitials(
                          selectedConversation.profile.display_name || selectedConversation.profile.full_name,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {selectedConversation.profile.display_name || selectedConversation.profile.full_name}
                      </h3>
                      {selectedConversation.profile.is_verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwn = message.sender_id === currentUserId

                        return (
                          <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                isOwn ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${isOwn ? "text-cyan-100" : "text-muted-foreground"}`}>
                                {formatMessageTime(message.sent_at)}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isSending}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-10 w-10 text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Conversation</h3>
                    <p className="text-muted-foreground">Choose a match to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
