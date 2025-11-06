import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveNav } from "@/components/responsive-nav"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Community Guidelines | Eboni Dating",
  description: "Our community standards and guidelines for creating a safe, respectful, and welcoming environment for all Eboni Dating members.",
  openGraph: {
    title: "Community Guidelines - Eboni Dating",
    description: "Creating a safe and respectful community together",
    type: "website",
  },
}

export default function CommunityGuidelinesPage() {
  const guidelines = [
    {
      title: "Be Authentic",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Always be yourself and represent yourself honestly.",
      rules: [
        "Use real, recent photos of yourself (no celebrity photos, AI-generated images, or photos of others)",
        "Provide accurate information about your age, location, and relationship status",
        "Don't create fake profiles or impersonate others",
        "Be genuine in your interactions and intentions",
        "One person, one account - multiple accounts are not allowed"
      ]
    },
    {
      title: "Respect Everyone",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      description: "Treat others the way you want to be treated.",
      rules: [
        "Be kind, courteous, and respectful in all interactions",
        "Accept rejection gracefully - 'no' means 'no'",
        "Respect people's boundaries and preferences",
        "Don't harass, stalk, or send unwanted messages after being told to stop",
        "Celebrate diversity - everyone's journey and identity deserves respect"
      ]
    },
    {
      title: "Stay Safe",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      description: "Protect yourself and others in the community.",
      rules: [
        "Never share financial information or send money to other members",
        "Don't share your home address or other sensitive personal information too quickly",
        "Meet in public places for first dates and tell a friend where you're going",
        "Report suspicious behavior immediately",
        "Trust your instincts - if something feels wrong, it probably is"
      ]
    },
    {
      title: "Keep It Appropriate",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      description: "Maintain a family-friendly environment.",
      rules: [
        "No nudity or sexually explicit content in photos or messages",
        "Don't use profanity excessively or in a demeaning way",
        "No adult content, pornography, or solicitation",
        "Keep profile photos appropriate - no underwear shots or explicit content",
        "Conversations should remain respectful and appropriate"
      ]
    },
    {
      title: "No Discrimination",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      description: "We celebrate diversity and inclusivity.",
      rules: [
        "No racism, sexism, homophobia, or any form of discrimination",
        "Don't use hate speech or slurs of any kind",
        "Respect all gender identities, sexual orientations, and expressions",
        "No body shaming, colorism, or discrimination based on appearance",
        "Celebrate the diversity within the Black diaspora"
      ]
    },
    {
      title: "No Scams or Spam",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
      description: "Keep the platform safe from fraud and spam.",
      rules: [
        "No soliciting money, gifts, or financial assistance",
        "Don't promote businesses, products, or services",
        "No phishing attempts or requests for personal/financial information",
        "Don't spam users with mass messages or generic copy-paste content",
        "No pyramid schemes, cryptocurrency scams, or investment schemes"
      ]
    }
  ]

  const violations = [
    {
      severity: "Warning",
      description: "Minor violations (e.g., inappropriate language) result in a warning",
      color: "bg-yellow-100 border-yellow-300 text-yellow-800"
    },
    {
      severity: "Temporary Ban",
      description: "Repeated violations or moderate offenses result in temporary suspension (7-30 days)",
      color: "bg-orange-100 border-orange-300 text-orange-800"
    },
    {
      severity: "Permanent Ban",
      description: "Serious violations (scams, harassment, hate speech) result in permanent account deletion",
      color: "bg-red-100 border-red-300 text-red-800"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <ResponsiveNav />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Community Guidelines
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Creating a safe, respectful, and welcoming space for everyone
          </p>
        </div>

        {/* Introduction */}
        <Alert className="max-w-4xl mx-auto mb-12 border-amber-300 bg-amber-50">
          <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <AlertDescription className="text-amber-900 ml-2">
            <strong>Welcome to Eboni Dating!</strong> Our community thrives when everyone feels safe, respected, and valued. 
            By using our platform, you agree to follow these guidelines. Violations may result in warnings, suspension, or permanent ban.
          </AlertDescription>
        </Alert>

        {/* Guidelines */}
        <div className="max-w-5xl mx-auto space-y-8 mb-12">
          {guidelines.map((guideline, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                    {guideline.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">{guideline.title}</CardTitle>
                    <CardDescription className="text-base">{guideline.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {guideline.rules.map((rule, ruleIdx) => (
                    <li key={ruleIdx} className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consequences */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Consequences of Violations
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {violations.map((violation, idx) => (
              <Card key={idx} className={`border-2 ${violation.color}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{violation.severity}</CardTitle>
                  <CardDescription className={violation.color.replace('bg-', 'text-').replace('-100', '-700')}>
                    {violation.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Reporting */}
        <Card className="max-w-4xl mx-auto mb-12 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
              Report Violations
            </CardTitle>
            <CardDescription className="text-base">
              If you encounter a violation of these guidelines, please report it immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              You can report any profile, message, or behavior that violates our community guidelines. 
              Our moderation team reviews all reports within 24 hours and takes appropriate action.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/safety">Safety Center</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Additional Resources
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/safety" className="flex items-start gap-3 p-6 rounded-lg border-2 hover:border-amber-300 hover:bg-amber-50 transition-colors">
              <svg className="h-6 w-6 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Safety Tips</div>
                <div className="text-sm text-gray-600">Learn how to stay safe while online dating</div>
              </div>
            </Link>

            <Link href="/faq" className="flex items-start gap-3 p-6 rounded-lg border-2 hover:border-amber-300 hover:bg-amber-50 transition-colors">
              <svg className="h-6 w-6 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              <div>
                <div className="font-semibold text-gray-900 mb-1">FAQ</div>
                <div className="text-sm text-gray-600">Find answers to common questions</div>
              </div>
            </Link>

            <Link href="/terms" className="flex items-start gap-3 p-6 rounded-lg border-2 hover:border-amber-300 hover:bg-amber-50 transition-colors">
              <svg className="h-6 w-6 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Terms of Service</div>
                <div className="text-sm text-gray-600">Review our terms and conditions</div>
              </div>
            </Link>

            <Link href="/privacy" className="flex items-start gap-3 p-6 rounded-lg border-2 hover:border-amber-300 hover:bg-amber-50 transition-colors">
              <svg className="h-6 w-6 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Privacy Policy</div>
                <div className="text-sm text-gray-600">Understand how we protect your data</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Be part of a respectful, safe, and vibrant community
          </p>
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Link href="/auth/sign-up">Get Started Free</Link>
          </Button>
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
