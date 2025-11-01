import Link from "next/link"
import Image from "next/image"
import { BannerHero } from "@/components/banner-hero"
import { ModelOfPeriod } from "@/components/model-of-period"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, MessageCircle, Users, Heart, Lock, Star } from "lucide-react"

export const metadata = {
  title: "Home - Find Love in the Black Community",
  description: "Join thousands of Black singles worldwide finding meaningful connections, love, and friendship in a culturally-rich, safe environment.",
}

export default function HomePage() {
  const models = [
    {
      id: "1",
      name: "Zara",
      avatar: "/model-1.jpg",
      images: ["/model-1.jpg", "/model-2.jpg", "/model-3.jpg"],
      likes: 2450,
      awardType: "day" as const,
    },
    {
      id: "2",
      name: "Amara",
      avatar: "/model-2.jpg",
      images: ["/model-2.jpg", "/model-3.jpg", "/model-4.jpg"],
      likes: 8920,
      awardType: "week" as const,
    },
    {
      id: "3",
      name: "Nadia",
      avatar: "/model-3.jpg",
      images: ["/model-3.jpg", "/model-4.jpg", "/model-5.jpg"],
      likes: 24500,
      awardType: "month" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/eboni-logo.png" 
              alt="Eboni Dating" 
              width={32} 
              height={32}
              priority
            />
            <span className="text-xl font-bold text-gray-900">Eboni Dating</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <BannerHero
          image="/model-1.jpg"
          title="Find Love Within the Black Community"
          subtitle="Join thousands of Black singles worldwide finding meaningful connections, love, and friendship in a culturally-rich, safe environment designed for our community."
          cta={{ text: "Get Started Free", href: "/auth/sign-up" }}
        />
      </section>

      {/* Model of the Day */}
      <section className="container mx-auto px-4 py-16">
        <ModelOfPeriod models={models} />
      </section>

      {/* Why Choose Section */}
      <section className="container mx-auto px-4 py-16 font-medium text-sidebar-primary-foreground">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Eboni Dating?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience a dating platform built specifically for the Black diaspora community
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-amber-200 transition-colors hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle>Verified Members</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Connect with verified members in a safe, moderated environment with profile verification and security
                features.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-200 transition-colors hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle>Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our advanced algorithm helps you find compatible matches based on your preferences, interests, cultural
                values, and relationship goals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-200 transition-colors hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-amber-600" />
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

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl my-16">
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">50K+</div>
                <div className="text-gray-600 font-medium">Active Members</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">10K+</div>
                <div className="text-gray-600 font-medium">Successful Matches</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2 flex items-center justify-center gap-1">
                  4.8
                  <Star className="h-8 w-8 fill-amber-600 text-amber-600" />
                </div>
                <div className="text-gray-600 font-medium">User Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Membership Tiers */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Membership Tiers</h2>
            <p className="text-lg text-gray-600">Choose the plan that fits your dating journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow border-2">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-600" />
                </div>
                <CardTitle className="text-lg">Basic</CardTitle>
                <CardDescription>Essential features for free members</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900 mb-4">Free</p>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-2 border-amber-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-amber-600">Most Popular</Badge>
              </div>
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Premium</CardTitle>
                <CardDescription>Unlimited messaging and priority support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900 mb-4">$9.99/mo</p>
                <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                  <Link href="/pricing">Upgrade Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-2">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg">VIP</CardTitle>
                <CardDescription>Exclusive access to premium events and features</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900 mb-4">$19.99/mo</p>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/pricing">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/pricing">View All Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 py-16">
        <BannerHero
          image="/model-2.jpg"
          title="Ready to Find Your Match?"
          subtitle="Join our community today and start connecting with amazing people who share your values and interests."
          cta={{ text: "Sign Up Now", href: "/auth/sign-up" }}
        />
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image 
                src="/eboni-logo.png" 
                alt="Eboni Dating" 
                width={20} 
                height={20}
              />
              <span className="font-semibold text-gray-900">Eboni Dating</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/terms" className="hover:text-amber-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-amber-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/pricing" className="hover:text-amber-600 transition-colors">
                Pricing
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-gray-500">
            © 2025 Eboni Dating. All rights reserved.
            <br />
            Celebrating Black love and connections worldwide.
          </div>
        </div>
      </footer>
    </div>
  )
}
