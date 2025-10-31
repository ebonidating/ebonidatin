"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile, ImageIcon, Mic, Send, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface EnhancedMessageInputProps {
  matchId: string
  senderId: string
  receiverId: string
  onMessageSent: () => void
}

const emojiCategories = {
  smileys: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😍", "🥰", "😘", "😗", "😙", "😚"],
  hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🦾"],
}

const gifCategories = [
  { id: "hello", query: "hello wave", preview: "👋" },
  { id: "love", query: "love heart", preview: "❤️" },
  { id: "laugh", query: "laughing funny", preview: "😂" },
  { id: "dance", query: "dancing celebration", preview: "💃" },
  { id: "kiss", query: "kiss romantic", preview: "😘" },
  { id: "hug", query: "hug comfort", preview: "🤗" },
]

export function EnhancedMessageInput({ matchId, senderId, receiverId, onMessageSent }: EnhancedMessageInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const handleSendMessage = async (content: string, type: "text" | "image" | "voice" | "gif" = "text") => {
    if (!content.trim() && type === "text") return

    setIsSending(true)
    try {
      const supabase = createClient()

      const { error } = await supabase.from("messages").insert({
        match_id: matchId,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        message_type: type,
        sent_at: new Date().toISOString(),
        is_read: false,
      })

      if (error) throw error

      setMessage("")
      onMessageSent()

      toast({
        title: "Message sent",
        description: "Your message has been delivered",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { url } = await response.json()
      await handleSendMessage(url, "image")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" })

        // Upload audio
        const formData = new FormData()
        formData.append("file", audioBlob, "voice-message.webm")

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")

        const { url } = await response.json()
        await handleSendMessage(url, "voice")

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const insertEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji)
  }

  const sendGif = (query: string) => {
    handleSendMessage(`/placeholder.svg?query=${encodeURIComponent(query)}`, "gif")
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="flex items-center gap-2">
        {/* Emoji Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              {Object.entries(emojiCategories).map(([category, emojis]) => (
                <div key={category}>
                  <p className="text-sm font-medium mb-2 capitalize">{category}</p>
                  <div className="grid grid-cols-9 gap-1">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="text-2xl hover:bg-accent rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* GIF Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm font-medium">Send a GIF</p>
              <div className="grid grid-cols-3 gap-2">
                {gifCategories.map((gif) => (
                  <button
                    key={gif.id}
                    onClick={() => sendGif(gif.query)}
                    className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center text-4xl hover:scale-105 transition-transform"
                  >
                    {gif.preview}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Image Upload */}
        <label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <Button variant="ghost" size="icon" type="button" asChild>
            <span>
              <ImageIcon className="h-5 w-5" />
            </span>
          </Button>
        </label>

        {/* Voice Recording */}
        {isRecording ? (
          <Button variant="destructive" size="icon" onClick={stopRecording}>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs">{recordingTime}s</span>
            </div>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={startRecording}>
            <Mic className="h-5 w-5" />
          </Button>
        )}

        {/* Message Input */}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage(message)
            }
          }}
          placeholder="Type a message..."
          className="flex-1"
          disabled={isSending}
        />

        {/* Send Button */}
        <Button
          onClick={() => handleSendMessage(message)}
          disabled={isSending || !message.trim()}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}
