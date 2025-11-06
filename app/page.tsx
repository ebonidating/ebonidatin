import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveNav } from "@/components/responsive-nav"

const BannerHero = dynamic(() => import("@/components/banner-hero").then(mod => ({ default: mod.BannerHero })), {
  loading: () => <div className="w-full h-64 md:h-96 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 animate-pulse" />
})

const ModelOfPeriod = dynamic(() => import("@/components/model-of-period").then(mod => ({ default: mod.ModelOfPeriod })), {
  ssr: false,
  loading: () => <div className="w-full h-96 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 animate-pulse" />
})

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
      {/* Responsive Header */}
      <ResponsiveNav />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-6 md:py-8">
          <BannerHero
            image="/hero-banner.jpg"
            title="Find Love Within the Black Community"
            subtitle="Join thousands of Black singles worldwide finding meaningful connections, love, and friendship."
            cta={{ text: "Get Started Free", href: "/auth/sign-up" }}
            priority
          />
        </section>

        {/* Top Models Section */}
        <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">Top Models</h2>
          <p className="text-base md:text-lg text-gray-600">Meet our most popular members</p>
        </div>
        <ModelOfPeriod models={models} />
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-b from-white to-amber-50 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">How It Works</h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Start your journey to finding love in just a few simple steps
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="relative mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl md:text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Create Profile</h3>
              <p className="text-sm md:text-base text-gray-600">
                Sign up free and build your profile in under 2 minutes
              </p>
            </div>
            <div className="text-center">
              <div className="relative mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl md:text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Get Matched</h3>
              <p className="text-sm md:text-base text-gray-600">
                Receive daily matches based on your preferences and interests
              </p>
            </div>
            <div className="text-center">
              <div className="relative mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl md:text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Start Chatting</h3>
              <p className="text-sm md:text-base text-gray-600">
                Connect and chat with matches who share your values
              </p>
            </div>
            <div className="text-center">
              <div className="relative mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl md:text-3xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Find Love</h3>
              <p className="text-sm md:text-base text-gray-600">
                Meet your perfect match and start your love story
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl md:rounded-2xl p-1">
          <Card className="max-w-4xl mx-auto border-0 bg-white">
            <CardContent className="p-6 md:p-8 lg:p-12">
              <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-600 mb-1 md:mb-2">50K+</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Active Members</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-600 mb-1 md:mb-2">10K+</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Successful Matches</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-600 mb-1 md:mb-2 flex items-center justify-center gap-0.5 md:gap-1">
                  4.8
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 fill-amber-600 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">User Rating</div>
              </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

        {/* Bottom CTA */}
        <section className="container mx-auto px-4 py-8 md:py-16">
          <BannerHero
            image="/couple-1.jpg"
            title="Ready to Find Your Match?"
            subtitle="Join our community today and start connecting with amazing people."
            cta={{ text: "Sign Up Now", href: "/auth/sign-up" }}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16" role="contentinfo">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Footer Links */}
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
              <Link href="/contact" className="hover:text-amber-600 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-gray-500">
            © 2024 Eboni Dating. All rights reserved.
            <br />
            Celebrating Black love and connections worldwide.
          </div>
        </div>
      </footer>
    </div>
  )
}
