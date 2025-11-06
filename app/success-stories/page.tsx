import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { ResponsiveNav } from "@/components/responsive-nav"

export const metadata: Metadata = {
  title: "Success Stories | Eboni Dating",
  description: "Read inspiring love stories from couples who found their perfect match on Eboni Dating. Real stories, real love, real connections.",
  openGraph: {
    title: "Success Stories - Eboni Dating",
    description: "Inspiring love stories from our community",
    type: "website",
  },
}

export default function SuccessStoriesPage() {
  const stories = [
    {
      id: 1,
      names: "Marcus & Amara",
      location: "Atlanta, GA",
      image: "/couple-1.jpg",
      matchDate: "March 2023",
      story: "We matched on a sunny Saturday morning, and from the first message, we knew there was something special. Marcus made me laugh with his witty opening line, and we talked for hours about everything from music to our dreams. Six months later, we're planning our future together. Thank you, Eboni Dating, for bringing us together!",
      quote: "Finding love that truly understands your culture is priceless. Eboni Dating made it possible.",
      engaged: true
    },
    {
      id: 2,
      names: "David & Zoe",
      location: "London, UK",
      image: "/couple-2.jpg",
      matchDate: "January 2023",
      story: "As a busy professional, I didn't have much time for dating. Eboni Dating's smart matching connected me with David, who shared my values and ambitions. We connected instantly over our love for African art and cuisine. Today, we're engaged and couldn't be happier!",
      quote: "The algorithm really works! We're so compatible, it's like we've known each other forever.",
      engaged: true
    },
    {
      id: 3,
      names: "James & Keisha",
      location: "Toronto, Canada",
      image: "/couple-3.jpg",
      matchDate: "June 2023",
      story: "After trying other dating apps, I almost gave up on online dating. Then I found Eboni Dating. The platform's focus on the Black community made all the difference. Keisha's profile caught my eye, and we bonded over our Caribbean heritage. We're now planning to move in together!",
      quote: "Finally, a platform that gets us. We're building our future together, one day at a time.",
      engaged: false
    },
    {
      id: 4,
      names: "Andre & Nia",
      location: "Paris, France",
      image: "/couple-4.jpg",
      matchDate: "April 2023",
      story: "Distance was never an issue for us. We matched when Andre was visiting Paris, and despite living in different cities initially, we made it work. The connection was too strong to let distance get in the way. Now we're engaged and planning our wedding in Ghana!",
      quote: "True love knows no boundaries. Eboni Dating helped us find each other across continents.",
      engaged: true
    },
    {
      id: 5,
      names: "Malik & Destiny",
      location: "New York, NY",
      image: "/couple-5.jpg",
      matchDate: "February 2023",
      story: "We were both skeptical about online dating, but Eboni Dating changed everything. The verification process made us feel safe, and the matching algorithm is incredibly accurate. We've been inseparable since our first date at a jazz club in Harlem. Best decision we ever made!",
      quote: "From first message to first date to forever. Thank you for believing in Black love.",
      engaged: false
    },
  ]

  const stats = [
    { value: "10,000+", label: "Successful Matches" },
    { value: "500+", label: "Engagements" },
    { value: "89%", label: "Match Satisfaction" },
    { value: "150+", label: "Marriages" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <ResponsiveNav />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Love Stories That Inspire
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Real couples, real connections, real love. Read their journeys from match to forever.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <Card key={idx} className="border-amber-200">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stories */}
        <div className="max-w-6xl mx-auto space-y-12">
          {stories.map((story, idx) => (
            <Card key={story.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`grid md:grid-cols-2 gap-0 ${idx % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                {/* Image */}
                <div className={`relative h-64 md:h-auto ${idx % 2 === 1 ? 'md:col-start-2' : ''}`}>
                  <Image
                    src={story.image}
                    alt={story.names}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {story.engaged && (
                    <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Engaged
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardHeader className="p-6 md:p-8">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {story.names}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          {story.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          Matched {story.matchDate}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {story.story}
                    </p>

                    <blockquote className="border-l-4 border-amber-500 pl-4 italic text-gray-600">
                      "{story.quote}"
                    </blockquote>
                  </div>
                </CardHeader>
              </div>
            </Card>
          ))}
        </div>

        {/* Share Your Story CTA */}
        <div className="text-center mt-16 p-8 md:p-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Found Love on Eboni Dating?
          </h2>
          <p className="text-amber-50 mb-6 max-w-xl mx-auto text-lg">
            Share your success story and inspire others in the community
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-amber-700 hover:bg-amber-50">
            <Link href="/contact">Share Your Story</Link>
          </Button>
        </div>

        {/* Join CTA */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Your Love Story Starts Here
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join thousands of Black singles finding meaningful connections and lasting love
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              © 2024 Eboni Dating. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/terms" className="hover:text-amber-600 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-amber-600 transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-amber-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
