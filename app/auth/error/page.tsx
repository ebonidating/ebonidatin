import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, AlertCircle } from "lucide-react"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-cyan-50 to-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-cyan-600 fill-cyan-600" />
            <span className="text-2xl font-bold text-gray-900">Eboni Dating</span>
          </Link>

          <Card className="border-2 border-red-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {params?.error_description ? (
                <p className="text-sm text-muted-foreground text-center">{params.error_description}</p>
              ) : params?.error ? (
                <p className="text-sm text-muted-foreground text-center">Error code: {params.error}</p>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  An unexpected error occurred during authentication.
                </p>
              )}
              <div className="pt-2 space-y-2">
                <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Link href="/auth/login">Try Again</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
