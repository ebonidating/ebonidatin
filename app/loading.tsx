import { Heart } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 mb-4 animate-pulse">
          <Heart className="h-8 w-8 text-cyan-600 fill-cyan-600" />
        </div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}
