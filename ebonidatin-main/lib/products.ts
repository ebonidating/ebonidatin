export interface SubscriptionProduct {
  id: string
  name: string
  description: string
  priceInCents: number
  interval: "month" | "year"
  features: string[]
  accessLevel: number // 0 = starter, 1 = advanced, 2 = premium, 3 = silver, 4 = gold
}

export const SUBSCRIPTION_PRODUCTS: SubscriptionProduct[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Basic features to get started",
    priceInCents: 0,
    interval: "month",
    accessLevel: 0,
    features: [
      "Basic profile",
      "Limited swipes per day (10)",
      "See who liked you (limited to 3)",
      "Basic filters",
      "Standard support",
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Enhanced matching and unlimited swipes",
    priceInCents: 999, // $9.99
    interval: "month",
    accessLevel: 1,
    features: [
      "Everything in Starter",
      "Unlimited swipes",
      "See all who liked you",
      "Advanced filters",
      "View user galleries",
      "Boost profile visibility",
      "Priority support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Premium features and customization",
    priceInCents: 1999, // $19.99
    interval: "month",
    accessLevel: 2,
    features: [
      "Everything in Advanced",
      "Incognito mode",
      "Rewind last swipe",
      "Unlimited super likes",
      "Profile customization",
      "Read receipts",
      "Video profiles",
      "VIP support",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    description: "Advanced analytics and exclusive features",
    priceInCents: 2499, // $24.99
    interval: "month",
    accessLevel: 3,
    features: [
      "Everything in Premium",
      "Advanced analytics",
      "Exclusive badges",
      "Priority matching",
      "Monthly profile review",
      "Event access",
      "Dedicated support",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    description: "Complete VIP experience",
    priceInCents: 2999, // $29.99
    interval: "month",
    accessLevel: 4,
    features: [
      "Everything in Silver",
      "Top profile placement",
      "VIP badges",
      "Advanced analytics dashboard",
      "Bi-weekly profile review",
      "Exclusive events",
      "Dedicated account manager",
    ],
  },
]

export function getProductById(id: string): SubscriptionProduct | undefined {
  return SUBSCRIPTION_PRODUCTS.find((p) => p.id === id)
}

export function getAccessLevel(planId: string): number {
  const product = getProductById(planId)
  return product?.accessLevel ?? 0
}

export function canAccessFeature(userPlanId: string, requiredPlanId: string): boolean {
  const userLevel = getAccessLevel(userPlanId)
  const requiredLevel = getAccessLevel(requiredPlanId)
  return userLevel >= requiredLevel
}
