"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Smile,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnhancedMessage {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  message_type: "text" | "image" | "video" | "voice" | "gif" | "link"
  media_url?: string
  created_at: string
  is_read: boolean
  has_read_receipt: boolean
  reactions?: { emoji: string; count: number; hasCurrentUserReacted: boolean }[]
  reply_to_message_id?: string
  reply_to_message?: EnhancedMessage
  is_edited?: boolean
  edited_at?: string
}

interface EnhancedChatInterfaceProps {
  currentUserId: string
  otherUserId: string
  matchId: string
  otherUserProfile: {
    id: string
    full_name: string | null
    display_name: string | null
    avatar_url?: string
  }
}

export function EnhancedChatInterface({
  currentUserId,
  otherUserId,
  matchId,
  otherUserProfile,
}: EnhancedChatInterfaceProps) {
  const [messages, setMessages] = useState<EnhancedMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<EnhancedMessage | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()
  const { toast } = useToast()

  // Fetch messages
  useEffect(() => {
    fetchMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as EnhancedMessage])
          scrollToBottom()
          markMessageAsRead(payload.new.id)
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
          )
        }
      )
      .subscribe()

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel(`typing_${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "typing_indicators",
          filter: `match_id=eq.${matchId},user_id=eq.${otherUserId}`,
        },
        () => {
          setIsTyping(true)
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "typing_indicators",
          filter: `match_id=eq.${matchId},user_id=eq.${otherUserId}`,
        },
        () => {
          setIsTyping(false)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(typingChannel)
    }
  }, [matchId, otherUserId, supabase])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select(
          `*,
          reactions:message_reactions(emoji, user_id),
          reply_to_message(*)
        `
        )
        .eq("match_id", matchId)
        .order("created_at", { ascending: true })

      if (error) throw error

      // Transform reactions data
      const transformedMessages = (data || []).map((msg) => ({
        ...msg,
        reactions: transformReactions(msg.reactions, currentUserId),
      }))

      setMessages(transformedMessages as EnhancedMessage[])
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const transformReactions = (reactions: any[], currentUserId: string) => {
    const grouped = reactions.reduce(
      (acc, reaction) => {
        if (!acc[reaction.emoji]) {
          acc[reaction.emoji] = { emoji: reaction.emoji, count: 0, users: [] }
        }
        acc[reaction.emoji].count++
        acc[reaction.emoji].users.push(reaction.user_id)
        return acc
      },
      {} as Record<string, any>
    )

    return Object.values(grouped).map((reaction) => ({
      emoji: reaction.emoji,
      count: reaction.count,
      hasCurrentUserReacted: reaction.users.includes(currentUserId),
    }))
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase.rpc("mark_message_as_read", {
        p_message_id: messageId,
        p_user_id: currentUserId,
      })
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const { data, error } = await supabase.from("chat_messages").insert({
        match_id: matchId,
        sender_id: currentUserId,
        receiver_id: otherUserId,
        message: newMessage,
        message_type: "text",
        reply_to_message_id: replyingTo?.id,
      })

      if (error) throw error

      setNewMessage("")
      setReplyingTo(null)
      removeTypingIndicator()
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleTyping = () => {
    addTypingIndicator()

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to remove typing indicator after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      removeTypingIndicator()
    }, 3000)
  }

  const addTypingIndicator = async () => {
    try {
      await supabase.from("typing_indicators").upsert(
        {
          match_id: matchId,
          user_id: currentUserId,
        },
        { onConflict: "match_id,user_id" }
      )
    } catch (error) {
      console.error("Error adding typing indicator:", error)
    }
  }

  const removeTypingIndicator = async () => {
    try {
      await supabase
        .from("typing_indicators")
        .delete()
        .eq("match_id", matchId)
        .eq("user_id", currentUserId)
    } catch (error) {
      console.error("Error removing typing indicator:", error)
    }
  }

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await supabase.from("message_reactions").insert({
        message_id: messageId,
        user_id: currentUserId,
        emoji,
      })
    } catch (error) {
      console.error("Error adding reaction:", error)
    }
  }

  const quickReactions = ["❤️", "😂", "😮", "😢", "👍"]

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {(otherUserProfile.display_name || otherUserProfile.full_name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {otherUserProfile.display_name || otherUserProfile.full_name}
              </CardTitle>
              {isTyping && (
                <p className="text-xs text-muted-foreground italic">typing...</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`max-w-xs lg:max-w-md`}>
                {/* Reply Preview */}
                {msg.reply_to_message && (
                  <div className="text-xs text-muted-foreground mb-2 pl-3 border-l-2 border-muted">
                    <div className="font-semibold">
                      {msg.reply_to_message.sender_id === currentUserId
                        ? "You"
                        : otherUserProfile.display_name}
                    </div>
                    <div className="truncate">{msg.reply_to_message.message}</div>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-lg px-4 py-2 ${
                    msg.sender_id === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                  {msg.is_edited && (
                    <p className="text-xs opacity-70 mt-1">(edited)</p>
                  )}
                </div>

                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {msg.reactions.map((reaction) => (
                      <button
                        key={reaction.emoji}
                        onClick={() => addReaction(msg.id, reaction.emoji)}
                        className={`text-xs px-2 py-1 rounded-full ${
                          reaction.hasCurrentUserReacted
                            ? "bg-primary/20"
                            : "bg-muted hover:bg-muted"
                        }`}
                      >
                        {reaction.emoji} {reaction.count}
                      </button>
                    ))}
                  </div>
                )}

                {/* Read Receipt */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  {msg.sender_id === currentUserId && (
                    <>
                      {msg.has_read_receipt ? (
                        <CheckCheck className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-muted border-t border-b flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold">Replying to:</span>
            <p className="text-xs text-muted-foreground truncate">
              {replyingTo.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(null)}
          >
            ✕
          </Button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={sendMessage} className="border-t p-4 space-y-3">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              handleTyping()
            }}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={sending || !newMessage.trim()} size="icon">
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Quick Reactions */}
        {showEmojiPicker && (
          <div className="flex gap-2 flex-wrap">
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setNewMessage(newMessage + emoji)
                  setShowEmojiPicker(false)
                }}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </form>
    </Card>
  )
}
