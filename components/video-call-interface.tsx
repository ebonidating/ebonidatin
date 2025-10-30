"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VideoCallInterfaceProps {
  otherUserName: string
  onEndCall: () => void
}

export function VideoCallInterface({ otherUserName, onEndCall }: VideoCallInterfaceProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    startLocalStream()

    return () => {
      stopLocalStream()
    }
  }, [])

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setLocalStream(stream)

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
    } catch (err) {
      setError("Failed to access camera/microphone. Please check permissions.")
    }
  }

  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const handleEndCall = () => {
    stopLocalStream()
    onEndCall()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Video Call with {otherUserName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Remote Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
              {otherUserName}
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <Monitor className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">Waiting for {otherUserName}...</p>
              </div>
            </div>
          </div>

          {/* Local Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">You</div>
            {!videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="h-12 w-12 text-white opacity-50" />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={videoEnabled ? "default" : "destructive"}
            size="icon"
            onClick={toggleVideo}
            className="h-12 w-12 rounded-full"
          >
            {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            variant={audioEnabled ? "default" : "destructive"}
            size="icon"
            onClick={toggleAudio}
            className="h-12 w-12 rounded-full"
          >
            {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          <Button variant="destructive" size="icon" onClick={handleEndCall} className="h-12 w-12 rounded-full">
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>

        <Alert>
          <AlertDescription className="text-sm">
            Note: This is a basic video call interface. For production use, integrate with a WebRTC service like Twilio,
            Agora, or Daily.co for full peer-to-peer video calling functionality.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
