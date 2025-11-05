import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const metadata = {
  title: "Safety & Security - Eboni Dating",
  description: "Your safety is our priority. Learn about our security features, safety tips, and how we protect our community.",
}

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-100 mb-6">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Safety & Security
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Your safety and privacy are our top priorities. We've implemented multiple layers of protection to ensure a secure dating experience.
          </p>
        </div>

        {/* Safety Features */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
            Our Safety Features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-amber-200 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-xl">Profile Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  All profiles are manually reviewed and verified. We use photo verification and ID checks to ensure authenticity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-xl">Encrypted Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  All messages are encrypted end-to-end. Your conversations remain private and secure at all times.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-xl">Block & Report</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  Easily block users and report inappropriate behavior. Our moderation team reviews all reports within 24 hours.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-xl">Privacy Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  Control who can see your profile and photos. Adjust your privacy settings anytime to your comfort level.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-xl">Safety Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  Access comprehensive safety guidelines and dating tips to help you stay safe both online and offline.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-lg md:text-xl">24/7 Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  Our team monitors the platform around the clock to ensure a safe and respectful community for everyone.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Safety Tips Section */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
            Dating Safety Tips
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-gray-800">
                <strong className="font-semibold">Meeting in Person:</strong> Always meet in a public place for the first few dates. Let a friend or family member know where you're going and who you're meeting.
              </AlertDescription>
            </Alert>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-gray-800">
                <strong className="font-semibold">Protect Your Information:</strong> Never share your home address, financial information, or other sensitive personal details with someone you've just met online.
              </AlertDescription>
            </Alert>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-gray-800">
                <strong className="font-semibold">Trust Your Instincts:</strong> If something feels off or too good to be true, trust your gut. It's okay to end conversations or block users who make you uncomfortable.
              </AlertDescription>
            </Alert>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-gray-800">
                <strong className="font-semibold">Take Your Time:</strong> Don't rush into meeting someone or sharing personal information. Get to know them through the platform's messaging system first.
              </AlertDescription>
            </Alert>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-gray-800">
                <strong className="font-semibold">Report Suspicious Behavior:</strong> If someone asks for money, acts inappropriately, or violates our community guidelines, report them immediately.
              </AlertDescription>
            </Alert>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-gray-800">
                <strong className="font-semibold">Video Chat First:</strong> Use video chat features to verify someone's identity before meeting in person. This helps ensure they are who they say they are.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Contact Support */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Need Help or Have Concerns?
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-6">
                Our safety team is here to help. Report any issues or concerns immediately, and we'll take action to protect our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/contact">Contact Safety Team</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/privacy">Privacy Policy</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
