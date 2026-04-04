import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ResponsiveNav } from "@/components/responsive-nav"

const BannerHero = dynamic(() => import("@/components/banner-hero").then(mod => ({ default: mod.BannerHero })), {
  loading: () => <div className="w-full h-64 md:h-96 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 animate-pulse" />
})

const ModelOfPeriod = dynamic(() => import("@/components/model-of-period").then(mod => ({ default: mod.ModelOfPeriod })), {
  ssr: false,
  loading: () => <div className="w-full h-96 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
})

export const metadata = {
  title: "Eboni Dating - Exclusive Black Love Community",
  description: "Experience premium dating designed for Black excellence. Verified members, curated connections, and meaningful relationships. Where culture meets connection.",
}

export default function HomePage() {
  const members = [
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Responsive Header */}
      <ResponsiveNav />

      {/* Main Content */}
      <main>
        {/* Premium Hero Section */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <BannerHero
            image="/hero-banner.jpg"
            title="Where Excellence Meets Connection"
            subtitle="Discover authentic relationships within our curated community of Black singles seeking meaningful connections. Premium matching, verified members, shared values."
            cta={{ text: "Begin Your Journey", href: "/auth/sign-up" }}
            priority
          />
        </section>

        {/* Featured Members Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-xs md:text-sm font-semibold text-amber-400 uppercase tracking-wider">Exceptional Members</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
              Meet Our Most Celebrated Members
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
              Discover members who embody excellence, authenticity, and shared values
            </p>
          </div>
          <ModelOfPeriod members={members} />
        </section>

        {/* Premium Features Section */}
        <section className="py-16 md:py-24 border-t border-slate-800">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {/* Feature 1: Verification */}
              <div className="group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent rounded-lg blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 group-hover:border-amber-400/30 transition-colors">
                    <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Verified Members</h3>
                    <p className="text-slate-400">Every profile is verified to ensure authenticity, safety, and genuine connections.</p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Smart Matching */}
              <div className="group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent rounded-lg blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 group-hover:border-amber-400/30 transition-colors">
                    <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Smart Matching</h3>
                    <p className="text-slate-400">Our AI-powered algorithm learns your preferences to deliver meaningful matches daily.</p>
                  </div>
                </div>
              </div>

              {/* Feature 3: Safe & Secure */}
              <div className="group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent rounded-lg blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 group-hover:border-amber-400/30 transition-colors">
                    <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Safe & Secure</h3>
                    <p className="text-slate-400">Privacy-first platform with encrypted messaging and multiple safety features.</p>
                  </div>
                </div>
              </div>

              {/* Feature 4: Premium Experience */}
              <div className="group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent rounded-lg blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 group-hover:border-amber-400/30 transition-colors">
                    <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Premium Features</h3>
                    <p className="text-slate-400">Exclusive tools for premium members including priority matches and advanced filters.</p>
                  </div>
                </div>
              </div>

              {/* Feature 5: Curated Community */}
              <div className="group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent rounded-lg blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 group-hover:border-amber-400/30 transition-colors">
                    <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Curated Community</h3>
                    <p className="text-slate-400">Join an exclusive community celebrating Black excellence, culture, and meaningful connections.</p>
                  </div>
                </div>
              </div>

              {/* Feature 6: Success Stories */}
              <div className="group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent rounded-lg blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 group-hover:border-amber-400/30 transition-colors">
                    <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1m2-1v2.5M4 7l2 1M4 7l-2 1m2-1v2.5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Love Stories</h3>
                    <p className="text-slate-400">Be inspired by thousands of couples who found lasting love on our platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900/50 to-transparent border-t border-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block mb-4">
                <span className="text-xs md:text-sm font-semibold text-amber-400 uppercase tracking-wider">Getting Started</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
                Your Journey to Love
              </h2>
              <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
                Simple, straightforward steps to finding meaningful connections
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-lg p-6 h-full">
                  <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 mb-4 mx-auto">
                    <span className="text-xl font-bold text-slate-900">1</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white text-center mb-3">Create Profile</h3>
                  <p className="text-sm md:text-base text-slate-400 text-center">
                    Build your authentic profile in minutes. Add photos, share your story, and set your preferences.
                  </p>
                </div>
                {/* Connector Line */}
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-amber-400/50 to-transparent" />
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-lg p-6 h-full">
                  <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 mb-4 mx-auto">
                    <span className="text-xl font-bold text-slate-900">2</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white text-center mb-3">Get Verified</h3>
                  <p className="text-sm md:text-base text-slate-400 text-center">
                    Quick verification ensures you&apos;re connecting with genuine members in a safe community.
                  </p>
                </div>
                {/* Connector Line */}
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-amber-400/50 to-transparent" />
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-lg p-6 h-full">
                  <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 mb-4 mx-auto">
                    <span className="text-xl font-bold text-slate-900">3</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white text-center mb-3">Discover Matches</h3>
                  <p className="text-sm md:text-base text-slate-400 text-center">
                    Receive personalized matches based on compatibility, values, and shared interests daily.
                  </p>
                </div>
                {/* Connector Line */}
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-amber-400/50 to-transparent" />
              </div>

              {/* Step 4 */}
              <div>
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-lg p-6 h-full">
                  <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 mb-4 mx-auto">
                    <span className="text-xl font-bold text-slate-900">4</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white text-center mb-3">Connect & Celebrate</h3>
                  <p className="text-sm md:text-base text-slate-400 text-center">
                    Chat, get to know each other, and build real connections with compatible partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 border-t border-slate-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Stat 1 */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mb-2">
                  50K+
                </div>
                <p className="text-base md:text-lg text-slate-400">Active Members</p>
                <p className="text-xs md:text-sm text-slate-500 mt-2">Growing daily with verified singles</p>
              </div>

              {/* Stat 2 */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <p className="text-base md:text-lg text-slate-400">Successful Matches</p>
                <p className="text-xs md:text-sm text-slate-500 mt-2">Real connections, lasting relationships</p>
              </div>

              {/* Stat 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">4.8</span>
                  <svg className="w-8 h-8 md:w-10 md:h-10 fill-amber-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <p className="text-base md:text-lg text-slate-400">User Rating</p>
                <p className="text-xs md:text-sm text-slate-500 mt-2">Trusted by thousands worldwide</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 border-t border-slate-800">
          <div className="container mx-auto px-4">
            <div className="relative">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 rounded-2xl blur-3xl" />
              
              <div className="relative bg-gradient-to-r from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-2xl p-8 md:p-16 text-center">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 text-balance">
                    Ready to Find Your Match?
                  </h2>
                  <p className="text-lg md:text-xl text-slate-300 mb-8 text-balance">
                    Join thousands of Black singles who are building meaningful relationships in our exclusive community.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold shadow-lg hover:shadow-xl transition-all">
                      <Link href="/auth/sign-up">
                        Start Free Today
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-slate-700 text-white hover:bg-slate-800/50">
                      <Link href="/auth/login">
                        Sign In
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 mt-6">
                    No credit card required. Create your profile in minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 md:mt-24 bg-gradient-to-b from-slate-950 to-black" role="contentinfo">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8">
            {/* Brand Column */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image 
                  src="/eboni-logo.png" 
                  alt="Eboni Dating" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-bold text-white">Eboni</span>
              </Link>
              <p className="text-sm text-slate-400">
                Celebrating Black excellence and meaningful connections.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/pricing" className="text-slate-400 hover:text-amber-400 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="text-slate-400 hover:text-amber-400 transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="text-slate-400 hover:text-amber-400 transition-colors">
                    Safety
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-amber-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-amber-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-400 hover:text-amber-400 transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-amber-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-amber-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/community-guidelines" className="text-slate-400 hover:text-amber-400 transition-colors">
                    Community Guidelines
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-500">
              © 2024 Eboni Dating. All rights reserved. Celebrating Black love worldwide.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-0.25 11-4-2.25 1.5-5.25 2.25-8 2.25 0-2 .75-4 2.25-5.5-2 .5-3.75 1.5-5 2.75z" /></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6m-6 0H2v14h4V8m0-4a2 2 0 1 1 0-4 2 2 0 0 1 0 4" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
