import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, MessageCircle, Shield, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-cyan-600 fill-cyan-600" />
            <span className="text-xl font-bold text-gray-900">Eboni Dating</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 border-cyan-200">
            <Heart className="h-3 w-3 mr-1 fill-cyan-700" />
            Trusted LGBTQ+ Dating Platform
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-balance">
            Find Meaningful Connections on Eboni Dating
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
            Join thousands of LGBTQ+ individuals finding love, friendship, and authentic connections in a safe,
            inclusive environment designed for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          <p className="text-sm text-gray-500">Free to join • No credit card required • 50,000+ users</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-cyan-200 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-cyan-600" />
              </div>
              <CardTitle>Verified Members</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Connect with verified LGBTQ+ members in a safe, moderated environment with profile verification and
                security features.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-cyan-200 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-cyan-600" />
              </div>
              <CardTitle>Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our advanced algorithm helps you find compatible matches based on your preferences, interests, and
                relationship goals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-cyan-200 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-cyan-600" />
              </div>
              <CardTitle>Rich Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Text, voice, and video calls with premium features. Connect meaningfully with unlimited messaging for
                paid members.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Membership Tiers</h2>
            <p className="text-lg text-gray-600">Choose the plan that fits your dating journey</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {/* Starter */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                  <div className="h-8 w-8 rounded-full bg-gray-400" />
                </div>
                <CardTitle className="text-lg">Starter</CardTitle>
                <CardDescription>Basic features</CardDescription>
              </CardHeader>
            </Card>

            {/* Advanced */}
            <Card className="text-center hover:shadow-lg transition-shadow border-cyan-200">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                  <div className="h-8 w-8 rounded-full bg-cyan-500" />
                </div>
                <CardTitle className="text-lg">Advanced</CardTitle>
                <CardDescription>Enhanced matching</CardDescription>
              </CardHeader>
            </Card>

            {/* Premium */}
            <Card className="text-center hover:shadow-lg transition-shadow border-purple-200">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-500" />
                </div>
                <CardTitle className="text-lg">Premium</CardTitle>
                <CardDescription>Priority support</CardDescription>
              </CardHeader>
            </Card>

            {/* Silver */}
            <Card className="text-center hover:shadow-lg transition-shadow border-gray-300">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <div className="h-8 w-8 rounded-full bg-gray-500" />
                </div>
                <CardTitle className="text-lg">Silver</CardTitle>
                <CardDescription>Advanced features</CardDescription>
              </CardHeader>
            </Card>

            {/* Gold */}
            <Card className="text-center hover:shadow-lg transition-shadow border-yellow-300">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                  <div className="h-8 w-8 rounded-full bg-yellow-500" />
                </div>
                <CardTitle className="text-lg">Gold</CardTitle>
                <CardDescription>Complete access</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700" asChild>
              <Link href="/pricing">View All Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-cyan-600 mb-2">50K+</div>
                <div className="text-gray-600 font-medium">Active Members</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-cyan-600 mb-2">10K+</div>
                <div className="text-gray-600 font-medium">Successful Matches</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-cyan-600 mb-2 flex items-center justify-center gap-1">
                  4.8
                  <Star className="h-8 w-8 fill-cyan-600 text-cyan-600" />
                </div>
                <div className="text-gray-600 font-medium">User Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-cyan-600 fill-cyan-600" />
              <span className="font-semibold text-gray-900">Eboni Dating</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/terms" className="hover:text-cyan-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-cyan-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/pricing" className="hover:text-cyan-600 transition-colors">
                Pricing
              </Link>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            © 2025 Eboni Dating. All rights reserved.
            <br />A safe and inclusive platform for LGBTQ+ connections.
          </div>
        </div>
      </footer>
    </div>
  )
}
