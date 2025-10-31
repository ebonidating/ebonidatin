"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  city: string
  country: string
  max_attendees: number
  current_attendees: number
  created_by: string
  attendees?: string[]
}

interface EventsCalendarProps {
  userId: string
  events: Event[]
}

export function EventsCalendar({ userId, events }: EventsCalendarProps) {
  const [localEvents, setLocalEvents] = useState(events)
  const { toast } = useToast()

  const handleRSVP = async (eventId: string) => {
    try {
      const supabase = createClient()
      const event = localEvents.find((e) => e.id === eventId)

      if (!event) return

      const isAttending = event.attendees?.includes(userId)

      if (isAttending) {
        // Cancel RSVP
        await supabase.from("event_attendees").delete().eq("event_id", eventId).eq("user_id", userId)

        setLocalEvents(
          localEvents.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  attendees: e.attendees?.filter((id) => id !== userId),
                  current_attendees: e.current_attendees - 1,
                }
              : e,
          ),
        )

        toast({
          title: "RSVP Cancelled",
          description: "You've cancelled your RSVP for this event",
        })
      } else {
        // Add RSVP
        await supabase.from("event_attendees").insert({
          event_id: eventId,
          user_id: userId,
          rsvp_at: new Date().toISOString(),
        })

        setLocalEvents(
          localEvents.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  attendees: [...(e.attendees || []), userId],
                  current_attendees: e.current_attendees + 1,
                }
              : e,
          ),
        )

        toast({
          title: "RSVP Confirmed",
          description: "You're attending this event!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update RSVP",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-600" />
            <CardTitle>Upcoming Events</CardTitle>
          </div>
          <CardDescription>Join local meetups and community events</CardDescription>
        </CardHeader>
      </Card>

      {localEvents.map((event) => {
        const isAttending = event.attendees?.includes(userId)
        const isFull = event.current_attendees >= event.max_attendees

        return (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  {isAttending && <Badge className="bg-green-500">Attending</Badge>}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.location}, {event.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.current_attendees}/{event.max_attendees} attending
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleRSVP(event.id)}
                  disabled={isFull && !isAttending}
                  className={isAttending ? "bg-red-500 hover:bg-red-600" : "bg-amber-600 hover:bg-amber-700"}
                  variant={isAttending ? "destructive" : "default"}
                >
                  {isAttending ? "Cancel RSVP" : isFull ? "Event Full" : "RSVP"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
