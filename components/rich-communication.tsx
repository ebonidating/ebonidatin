"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Smile, Send, Paperclip, Mic } from "lucide-react"

interface RichCommunicationProps {
  recipientId: string
  onSendMessage: (message: string, type: "text" | "emoji" | "voice") => void
}

export function RichCommunication({ recipientId, onSendMessage }: RichCommunicationProps) {
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"text" | "emoji" | "voice">("text")

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, messageType)
      setMessage("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Message</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-24"
        />

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={messageType === "text" ? "default" : "outline"}
            size="sm"
            onClick={() => setMessageType("text")}
          >
            <Send className="h-4 w-4 mr-2" />
            Text
          </Button>
          <Button
            variant={messageType === "emoji" ? "default" : "outline"}
            size="sm"
            onClick={() => setMessageType("emoji")}
          >
            <Smile className="h-4 w-4 mr-2" />
            Emoji
          </Button>
          <Button
            variant={messageType === "voice" ? "default" : "outline"}
            size="sm"
            onClick={() => setMessageType("voice")}
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice
          </Button>
          <Button variant="outline" size="sm">
            <Paperclip className="h-4 w-4 mr-2" />
            Attach
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            React
          </Button>
        </div>

        <Button onClick={handleSend} className="w-full bg-amber-600 hover:bg-amber-700">
          Send Message
        </Button>
      </CardContent>
    </Card>
  )
}
