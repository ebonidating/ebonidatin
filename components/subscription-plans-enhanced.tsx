"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles, Users, Building2, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BillingInterval, BILLING_TIERS, getTierPrice } from "@/lib/subscription/billing-config"

interface SubscriptionPlansEnhancedProps {
  userId: string
  currentPlan?: string
  currentInterval?: BillingInterval
}

const PLAN_ICONS = {
  premium: Sparkles,
  vip: Crown,
  model_pro: Crown,
  family: Users,
  corporate: Building2,
}

const PLAN_COLORS = {
  premium: { text: "text-cyan-600", bg: "bg-cyan-100", border: "border-cyan-500" },
  vip: { text: "text-purple-600", bg: "bg-purple-100", border: "border-purple-500" },
  model_pro: { text: "text-pink-600", bg: "bg-pink-100", border: "border-pink-500" },
  family: { text: "text-blue-600", bg: "bg-blue-100", border: "border-blue-500" },
  corporate: { text: "text-amber-600", bg: "bg-amber-100", border: "border-amber-500" },
}

interface Feature {
  name: string
  included: Record<string, boolean>
}

const FEATURES: Feature[] = [
  {
    name: "Create Profile",
    included: {
      premium: true,
      vip: true,
      model_pro: true,
      family: true,
      corporate: true,
    },
  },
  {
    name: "Unlimited Messaging",
    included: {
      premium: true,
      vip: true,
      model_pro: true,
      family: true,
      corporate: true,
    },
  },
  {
    name: "See Who Liked You",
    included: {
      premium: true,
      vip: true,
      model_pro: true,
      family: true,
      corporate: true,
    },
  },
  {
    name: "Advanced Filters",
    included: {
      premium: true,
      vip: true,
      model_pro: true,
      family: true,
      corporate: true,
    },
  },
  {
    name: "Video Calls",
    included: {
      premium: true,
      vip: true,
      model_pro: true,
      family: true,
      corporate: true,
    },
  },
  {
    name: "Incognito Mode",
    included: {
      premium: false,
      vip: true,
      model_pro: true,
      family: true,
      corporate: true,
    },
  },
  {
    name: "Verified Badge",
    included: {
      premium: false,
      vip: true,
      model_pro: true,
      family: true,
      corporate: true,
    },
  },
  {
    name: "Portfolio Showcase",
    included: {
      premium: false,
      vip: false,
      model_pro: true,
      family: false,
      corporate: true,
    },
  },
  {
    name: "Booking System",
    included: {
      premium: false,
      vip: false,
      model_pro: true,
      family: false,
      corporate: true,
    },
  },
  {
    name: "Family Sharing",
    included: {
      premium: false,
      vip: false,
      model_pro: false,
      family: true,
      corporate: true,
    },
  },
  {
    name: "Corporate Admin Panel",
    included: {
      premium: false,
      vip: false,
      model_pro: false,
      family: false,
      corporate: true,
    },
  },
  {
    name: "Priority Support",
    included: {
      premium: false,
      vip: true,
      model_pro: true,
      family: true,
      corporate: true,
    },
  },
]

export function SubscriptionPlansEnhanced({
  userId,
  currentPlan = "free",
  currentInterval = "monthly",
}: SubscriptionPlansEnhancedProps) {
  const [interval, setInterval] = useState<BillingInterval>(currentInterval)
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubscribe = async (tierId: string) => {
    setLoading(tierId)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: tierId,
          userId,
          interval,
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

  const tiers = Object.values(BILLING_TIERS).filter((t) => t.id !== "free")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Unlock premium features and find your perfect match faster
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-4">
        <span className={`text-sm ${interval === "monthly" ? "font-semibold" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <button
          onClick={() => setInterval(interval === "monthly" ? "annual" : "monthly")}
          className="relative inline-flex h-8 w-14 items-center rounded-full bg-muted"
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-background shadow-lg transition-transform ${
              interval === "annual" ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`text-sm ${interval === "annual" ? "font-semibold" : "text-muted-foreground"}`}>
          Annual
          {interval === "annual" && <Badge className="ml-2 bg-green-600">Save 17%</Badge>}
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        {tiers.map((tier) => {
          const Icon = PLAN_ICONS[tier.id as keyof typeof PLAN_ICONS] || Zap
          const colors = PLAN_COLORS[tier.id as keyof typeof PLAN_COLORS]
          const isCurrentPlan = currentPlan === tier.id
          const price = getTierPrice(tier.id, interval)
          const displayPrice = interval === "annual" && price > 0 ? (price / 12).toFixed(2) : price.toFixed(2)

          return (
            <Card
              key={tier.id}
              className={`relative flex flex-col ${
                tier.popular ? `border-2 ${colors.border} shadow-lg` : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-500">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <div className={`h-12 w-12 rounded-full ${colors.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription className="text-xs">{tier.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Pricing */}
                <div className="space-y-1">
                  {price > 0 ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">${displayPrice}</span>
                        <span className="text-muted-foreground text-sm">/month</span>
                      </div>
                      {interval === "annual" && (
                        <p className="text-xs text-muted-foreground">
                          ${price.toFixed(2)}/year (save ${((getTierPrice(tier.id, "monthly") * 12 - price).toFixed(2))})
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-2xl font-bold">Free</div>
                  )}
                </div>

                {/* Max Users for Family/Corporate */}
                {tier.maxUsers && (
                  <p className="text-xs text-muted-foreground border-t pt-3">
                    Up to {tier.maxUsers} {tier.maxUsers === 1 ? "user" : "users"}
                  </p>
                )}

                {/* Key Features */}
                <ul className="space-y-2">
                  {FEATURES.slice(0, 4).map((feature) => (
                    <li key={feature.name} className="flex items-start gap-2 text-sm">
                      {feature.included[tier.id] ? (
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={feature.included[tier.id] ? "" : "text-muted-foreground line-through"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={isCurrentPlan || loading === tier.id}
                  className={`w-full mt-auto ${
                    tier.popular && !isCurrentPlan ? "bg-amber-600 hover:bg-amber-700" : ""
                  }`}
                  variant={isCurrentPlan ? "outline" : "default"}
                >
                  {loading === tier.id
                    ? "Processing..."
                    : isCurrentPlan
                      ? "Current Plan"
                      : tier.id === "free"
                        ? "Get Started"
                        : "Upgrade Now"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Features Comparison */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-center">Compare All Features</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Feature</th>
                {tiers.map((tier) => (
                  <th key={tier.id} className="text-center py-3 px-4 font-semibold">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature) => (
                <tr key={feature.name} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{feature.name}</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {feature.included[tier.id] ? (
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
