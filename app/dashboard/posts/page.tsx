import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { VideoUploadForm } from "@/components/video-upload-form"
import { PostsFeed } from "@/components/posts-feed"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function PostsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
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
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Video Posts</h1>

          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="feed">All Posts</TabsTrigger>
              <TabsTrigger value="upload">Upload Video</TabsTrigger>
            </TabsList>

            <TabsContent value="feed">
              <PostsFeed />
            </TabsContent>

            <TabsContent value="upload">
              <VideoUploadForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
