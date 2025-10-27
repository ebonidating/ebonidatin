"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles, Zap, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SUBSCRIPTION_PRODUCTS } from "@/lib/products"
import { startCheckoutSession } from "@/app/actions/stripe"

interface SubscriptionPlansProps {
  userId: string
  currentPlan?: string
}

const planIcons = {
  starter: Zap,
  advanced: Sparkles,
  premium: Crown,
  silver: Award,
  gold: Crown,
}

const planColors = {
  starter: { text: "text-gray-600", bg: "bg-gray-100" },
  advanced: { text: "text-cyan-600", bg: "bg-cyan-100" },
  premium: { text: "text-purple-600", bg: "bg-purple-100" },
  silver: { text: "text-gray-600", bg: "bg-gray-200" },
  gold: { text: "text-yellow-600", bg: "bg-yellow-100" },
}

export function SubscriptionPlans({ userId, currentPlan = "starter" }: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubscribe = async (planId: string) => {
    if (planId === "starter") {
      toast({
        title: "Already on Starter",
        description: "You're already on the free Starter plan",
      })
      return
    }

    setLoading(planId)

    try {
      const url = await startCheckoutSession(planId, userId)
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("[v0] Subscription error:", error)
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

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        {SUBSCRIPTION_PRODUCTS.map((plan) => {
          const Icon = planIcons[plan.id as keyof typeof planIcons]
          const colors = planColors[plan.id as keyof typeof planColors]
          const isCurrentPlan = currentPlan === plan.id
          const isPopular = plan.id === "advanced"

          return (
            <Card key={plan.id} className={`relative ${isPopular ? "border-2 border-amber-500 shadow-lg" : ""}`}>
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-500">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <div className={`h-12 w-12 rounded-full ${colors.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.priceInCents === 0 ? (
                    <span className="text-2xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${(plan.priceInCents / 100).toFixed(2)}</span>
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
                  className={`w-full ${isPopular ? "bg-amber-600 hover:bg-amber-700" : ""}`}
                  variant={isCurrentPlan ? "outline" : "default"}
                >
                  {loading === plan.id
                    ? "Processing..."
                    : isCurrentPlan
                      ? "Current Plan"
                      : plan.priceInCents === 0
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
