"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Loader2, CheckCircle } from "lucide-react"

interface VideoUploadFormProps {
  onSuccess?: () => void
}

export function VideoUploadForm({ onSuccess }: VideoUploadFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus()
    }
  }, [error])

  useEffect(() => {
    if (success && successRef.current) {
      successRef.current.focus()
    }
  }, [success])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!file) {
      setError("Please select a video file")
      setLoading(false)
      return
    }

    if (!title.trim()) {
      setError("Please enter a title")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("video", file)
      formData.append("title", title)
      formData.append("description", description)

      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      setSuccess(true)
      setTitle("")
      setDescription("")
      setFile(null)

      // Reset form after 2 seconds
      setTimeout(() => {
        setSuccess(false)
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError("Failed to upload video. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
        <CardDescription>Share your moments with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
          {error && (
            <div ref={errorRef} tabIndex={-1}>
              <Alert variant="destructive" aria-live="polite">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {success && (
            <div ref={successRef} tabIndex={-1}>
              <Alert className="bg-green-50 text-green-900 border-green-200" aria-live="polite">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Video uploaded successfully!</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a title"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your video..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video File *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
                className="cursor-pointer"
              />
            </div>
            {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
