import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft, Check } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Choose the perfect membership plan for your dating journey on Eboni Dating",
}

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for getting started",
      features: ["Create profile", "Browse members", "Limited likes per day", "Basic matching"],
      color: "gray",
    },
    {
      name: "Advanced",
      price: "$9.99/mo",
      description: "Enhanced matching features",
      features: [
        "Everything in Starter",
        "Unlimited likes",
        "See who liked you",
        "Advanced filters",
        "Priority support",
      ],
      color: "cyan",
      popular: true,
    },
    {
      name: "Premium",
      price: "$19.99/mo",
      description: "Complete dating experience",
      features: [
        "Everything in Advanced",
        "Unlimited messaging",
        "Video calls",
        "Profile boost",
        "Read receipts",
        "Incognito mode",
      ],
      color: "purple",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-cyan-600 fill-cyan-600" />
            <span className="text-xl font-bold text-gray-900">Eboni Dating</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the membership that fits your dating journey. All plans include our core features and safe, inclusive
            environment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? "border-2 border-cyan-500 shadow-xl" : "border-2"}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-cyan-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">{plan.price}</div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${plan.popular ? "bg-cyan-600 hover:bg-cyan-700" : ""}`} asChild>
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include a 7-day free trial. Cancel anytime.{" "}
            <Link href="/terms" className="text-cyan-600 hover:text-cyan-700">
              Terms apply
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
