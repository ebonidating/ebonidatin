import { Skeleton } from "@/components/ui/skeleton"

export function ChatListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
          {/* Avatar */}
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>

          {/* Time */}
          <Skeleton className="h-3 w-12 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-10 w-10" />
    </div>
  )
}

export function ChatMessageSkeleton() {
  return (
    <div className="space-y-4">
      {/* Own message */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Other message */}
      <div className="flex justify-start">
        <Skeleton className="h-10 w-56" />
      </div>

      {/* Own message */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Other message */}
      <div className="flex justify-start">
        <Skeleton className="h-10 w-52" />
      </div>
    </div>
  )
}
