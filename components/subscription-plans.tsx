"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionPlansProps {
  userId: string
  currentPlan?: string
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    interval: "forever",
    icon: Zap,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    features: [
      "Basic profile",
      "Limited swipes per day",
      "See who liked you (limited)",
      "Basic filters",
      "Standard support",
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    price: 9.99,
    interval: "month",
    icon: Sparkles,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    features: [
      "Everything in Starter",
      "Unlimited swipes",
      "See all who liked you",
      "Advanced filters",
      "Boost profile visibility",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    interval: "month",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    features: [
      "Everything in Advanced",
      "Incognito mode",
      "Rewind last swipe",
      "Unlimited super likes",
      "Profile customization",
      "Read receipts",
      "VIP support",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 29.99,
    interval: "month",
    icon: Crown,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    features: [
      "Everything in Premium",
      "Top profile placement",
      "Exclusive badges",
      "Video profiles",
      "Advanced analytics",
      "Monthly profile review",
      "Dedicated account manager",
    ],
  },
]

export function SubscriptionPlans({ userId, currentPlan = "starter" }: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          userId,
        }),
      })

      if (!response.ok) throw new Error("Failed to create checkout session")

      const { url } = await response.json()

      window.location.href = url
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start subscription process",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">Unlock premium features and find your perfect match faster</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = currentPlan === plan.id

          return (
            <Card key={plan.id} className={`relative ${plan.popular ? "border-2 border-amber-500 shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-500">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <div className={`h-12 w-12 rounded-full ${plan.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${plan.color}`} />
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.price === 0 ? (
                    <span className="text-2xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.interval}</span>
                    </>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan || loading === plan.id}
                  className={`w-full ${plan.popular ? "bg-amber-600 hover:bg-amber-700" : ""}`}
                  variant={isCurrentPlan ? "outline" : "default"}
                >
                  {loading === plan.id
                    ? "Processing..."
                    : isCurrentPlan
                      ? "Current Plan"
                      : plan.price === 0
                        ? "Get Started"
                        : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
