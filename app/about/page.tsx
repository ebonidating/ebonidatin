import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "About Us - Eboni Dating",
  description: "Learn about Eboni Dating, the premier dating platform for the Black diaspora community worldwide.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            About Eboni Dating
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Connecting Black singles worldwide through meaningful relationships and cultural understanding
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <Card className="border-2 border-amber-200">
            <CardContent className="p-6 md:p-8 lg:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
                Our Mission
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                Eboni Dating was founded in 2024 with a simple yet powerful mission: to create a safe, 
                culturally-rich environment where Black singles can find meaningful connections, love, and friendship.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                We understand the unique experiences and values of the Black diaspora community, and we've built 
                our platform to celebrate and honor those experiences while helping you find your perfect match.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-amber-200 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-xl">Cultural Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  We celebrate Black culture and create connections based on shared experiences and values.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-xl">Safety First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  Every profile is verified and our platform is actively moderated for your protection.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-xl">Authenticity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  We promote genuine connections and authentic profiles - no fake accounts allowed.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  We use advanced matching algorithms that understand cultural compatibility.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl md:rounded-2xl p-1 mb-12 md:mb-16">
          <Card className="max-w-4xl mx-auto border-0 bg-white">
            <CardContent className="p-6 md:p-8 lg:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                Our Community
              </h2>
              <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-600 mb-2">50K+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Active Members</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-600 mb-2">10K+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Successful Matches</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-600 mb-2 flex items-center justify-center gap-1">
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

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
            Start your journey to finding meaningful connections within the Black community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
