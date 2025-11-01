"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Send, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface RichMessageInputProps {
  receiverId: string
  onSend?: () => void
}

export function RichMessageInput({ receiverId, onSend }: RichMessageInputProps) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return

    setSending(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: receiverId,
        message: message.trim(),
        message_type: "text",
      })

      if (error) throw error

      setMessage("")
      setSelectedEmoji(null)
      onSend?.()
    } catch (error) {
      // Message state is maintained for retry
    } finally {
      setSending(false)
    }
  }

  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji)
  }

  const emojis = ["❤️", "😊", "😂", "🔥", "✨", "👍", "🎉", "💯"]

  return (
    <div className="space-y-3 p-4 border-t bg-white rounded-b-lg">
      <div className="flex gap-2 flex-wrap">
        {emojis.map((emoji) => (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            onClick={() => addEmoji(emoji)}
            className="text-lg hover:bg-gray-100 min-w-[24px] min-h-[24px]"
            aria-label={`Add ${emoji} emoji`}
          >
            {emoji}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message... (supports emojis)"
          className="resize-none"
          rows={2}
        />
        <div className="flex flex-col gap-2">
          <Button size="icon" variant="outline" title="Add image" aria-label="Add image">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={sending || !message.trim()}
            className="bg-cyan-600 hover:bg-cyan-700"
            aria-label={sending ? "Sending message" : "Send message"}
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
