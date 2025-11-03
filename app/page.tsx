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

      {/* About Us Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">About Us</h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Eboni Dating is a premier platform built for the Black diaspora community worldwide
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-amber-200 transition-colors hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
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
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
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
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
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
              <Link href="/contact" className="hover:text-amber-600 transition-colors">
                Contact Us
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
