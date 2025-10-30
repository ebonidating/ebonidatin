"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface MembershipPlan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
}

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Get started with basic features",
    features: ["Browse profiles", "Limited likes (5/day)", "Basic messaging", "No gallery access"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    description: "Enhanced dating experience",
    features: ["Unlimited likes", "Priority messaging", "Gallery access", "See who liked you"],
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    price: 19.99,
    description: "Premium features plus exclusives",
    features: ["All Premium features", "Advanced filters", "Verified badge", "Model showcase"],
  },
  {
    id: "model_pro",
    name: "Model Pro",
    price: 29.99,
    description: "For professional models",
    features: ["All VIP features", "Portfolio builder", "Booking system", "Analytics dashboard"],
  },
]

interface MembershipSelectorProps {
  onSelect: (planId: string) => void
  selectedPlan?: string
}

export function MembershipSelector({ onSelect, selectedPlan }: MembershipSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Membership</h3>
        <p className="text-sm text-gray-600">Select a plan that works best for you</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {MEMBERSHIP_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all ${
              selectedPlan === plan.id ? "ring-2 ring-amber-600 shadow-lg" : "hover:shadow-md"
            } ${plan.popular ? "md:scale-105" : ""}`}
            onClick={() => onSelect(plan.id)}
          >
            <CardHeader>
              {plan.popular && <div className="text-xs font-bold text-amber-600 mb-2">MOST POPULAR</div>}
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-sm text-gray-600">/month</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${selectedPlan === plan.id ? "bg-amber-600 hover:bg-amber-700" : ""}`}
                variant={selectedPlan === plan.id ? "default" : "outline"}
              >
                {selectedPlan === plan.id ? "Selected" : "Select"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
