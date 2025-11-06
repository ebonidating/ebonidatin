import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveNav } from "@/components/responsive-nav"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Eboni Dating",
  description: "Find answers to common questions about Eboni Dating, our features, safety, subscriptions, and more.",
  openGraph: {
    title: "FAQ - Eboni Dating",
    description: "Get answers to your questions about Eboni Dating",
    type: "website",
  },
}

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Get Started' or 'Sign Up' on the homepage. You can register using your email or sign up instantly with Google. Fill in your basic information, verify your email (for email signups), and you're ready to start connecting!"
        },
        {
          q: "Is Eboni Dating really free?",
          a: "Yes! Our basic membership is completely free. You can create a profile, browse members, send likes, and send limited messages. Premium and Elite tiers offer additional features like unlimited messaging, advanced filters, and priority support."
        },
        {
          q: "How do I verify my email?",
          a: "After signing up with email, check your inbox for a verification link. Click it to verify your account. If you don't see the email, check your spam folder. Google OAuth users are automatically verified."
        },
        {
          q: "What makes Eboni Dating different?",
          a: "Eboni Dating is built specifically for the Black diaspora community worldwide. We understand cultural nuances and values, provide a safe and moderated environment, and use smart matching algorithms tailored to your preferences."
        }
      ]
    },
    {
      category: "Profile & Matching",
      questions: [
        {
          q: "How does the matching algorithm work?",
          a: "Our algorithm considers your location, age preferences, interests, relationship goals, and cultural values to suggest compatible matches. The more complete your profile, the better your matches!"
        },
        {
          q: "How do I complete my profile?",
          a: "Go to your Dashboard > Edit Profile. Add photos, write a compelling bio, select your interests, and set your preferences. A complete profile gets up to 5x more matches!"
        },
        {
          q: "Can I change my profile information later?",
          a: "Absolutely! You can update your profile, photos, bio, and preferences anytime from your dashboard."
        },
        {
          q: "How many photos can I upload?",
          a: "Free members can upload up to 6 photos. Premium members get unlimited photo uploads and access to private galleries."
        }
      ]
    },
    {
      category: "Messaging & Communication",
      questions: [
        {
          q: "How do I send a message?",
          a: "Visit a member's profile and click the 'Send Message' button. You can also message your matches directly from the Messages section in your dashboard."
        },
        {
          q: "Can I send voice or video messages?",
          a: "Yes! Premium and Elite members can send voice messages, video messages, and even schedule video calls with their matches."
        },
        {
          q: "What are icebreakers?",
          a: "Icebreakers are fun conversation starters to help you break the ice with new matches. We provide suggestions, or you can create your own!"
        },
        {
          q: "How do I know if someone read my message?",
          a: "Premium and Elite members get read receipts showing when messages are read. Free members can see delivery status."
        }
      ]
    },
    {
      category: "Safety & Privacy",
      questions: [
        {
          q: "Is my personal information safe?",
          a: "Yes! We use bank-level encryption, never share your data with third parties, and comply with international privacy laws. Your email and phone number are never publicly visible."
        },
        {
          q: "How do I report suspicious profiles?",
          a: "Click the three dots on any profile and select 'Report'. Our moderation team reviews all reports within 24 hours and takes appropriate action."
        },
        {
          q: "Can I block someone?",
          a: "Yes! You can block any user from their profile. Blocked users won't be able to see your profile, message you, or appear in your search results."
        },
        {
          q: "How does profile verification work?",
          a: "We verify profiles through email/phone verification, photo verification (selfie with specific pose), and ID verification for premium members. Verified profiles get a badge."
        }
      ]
    },
    {
      category: "Subscriptions & Billing",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, Mastercard, Amex), debit cards, and digital wallets through our secure Stripe payment processor."
        },
        {
          q: "Can I cancel my subscription anytime?",
          a: "Yes! You can cancel your subscription anytime from your Account Settings. You'll continue to have premium access until the end of your billing period."
        },
        {
          q: "Do you offer refunds?",
          a: "Refunds are considered on a case-by-case basis within 14 days of purchase. Contact our support team with your request."
        },
        {
          q: "What's the difference between Premium and Elite?",
          a: "Premium includes unlimited messaging, advanced filters, and read receipts. Elite adds video calls, profile boost, priority support, and exclusive events access. See our Pricing page for full details."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          q: "The site isn't loading properly. What should I do?",
          a: "Try clearing your browser cache, updating your browser to the latest version, or trying a different browser. If issues persist, contact our support team."
        },
        {
          q: "I forgot my password. How do I reset it?",
          a: "Click 'Forgot Password' on the login page. Enter your email and we'll send you a reset link. The link expires in 24 hours."
        },
        {
          q: "Can I use Eboni Dating on my phone?",
          a: "Yes! Our site is fully mobile-responsive and works on all devices. You can also add it to your home screen for an app-like experience. Native iOS and Android apps are coming soon!"
        },
        {
          q: "I'm not receiving emails. What should I do?",
          a: "Check your spam/junk folder. Add noreply@ebonidating.com to your contacts. If you still don't receive emails, contact support to update your email address."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <ResponsiveNav />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Eboni Dating
          </p>
        </div>

        {/* Quick Contact */}
        <Card className="max-w-4xl mx-auto mb-8 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Can't find what you're looking for?
            </CardTitle>
            <CardDescription>
              Our support team is here to help!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/safety">Safety Center</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((category, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-2xl text-amber-700">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, qIdx) => (
                    <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                      <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-amber-600">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Love?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join thousands of Black singles finding meaningful connections
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
