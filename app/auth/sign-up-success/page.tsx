import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-cyan-50 to-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-cyan-600 fill-cyan-600" />
            <span className="text-2xl font-bold text-gray-900">Eboni Dating</span>
          </Link>

          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center">
                <Mail className="h-8 w-8 text-cyan-600" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>We&apos;ve sent you a verification link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Please check your email and click the verification link to activate your account. Once verified, you can
                sign in and start connecting with others.
              </p>
              <div className="pt-2">
                <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Link href="/auth/login">Go to Sign In</Link>
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or try signing up again.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
