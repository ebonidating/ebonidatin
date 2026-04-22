/**
 * Billing Configuration
 * Defines pricing, billing intervals, and tier information
 */

export type BillingInterval = "monthly" | "annual"
export type SubscriptionTier = "free" | "premium" | "vip" | "model_pro" | "corporate" | "family"

export interface TierPricing {
  monthly: number
  annual: number
  annualSavings: number // percentage savings compared to monthly
}

export interface BillingTierInfo {
  id: SubscriptionTier
  name: string
  description: string
  pricing: TierPricing
  stripeMonthlyPriceId?: string
  stripeAnnualPriceId?: string
  maxUsers?: number // for family/corporate plans
  popular?: boolean
  badge?: string
}

export const BILLING_TIERS: Record<SubscriptionTier, BillingTierInfo> = {
  free: {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    pricing: {
      monthly: 0,
      annual: 0,
      annualSavings: 0,
    },
  },
  premium: {
    id: "premium",
    name: "Premium",
    description: "For serious daters",
    pricing: {
      monthly: 9.99,
      annual: 99.99,
      annualSavings: 17, // ~$20 savings per year
    },
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    stripeAnnualPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID,
    popular: true,
  },
  vip: {
    id: "vip",
    name: "VIP",
    description: "VIP treatment and priority matching",
    pricing: {
      monthly: 19.99,
      annual: 199.99,
      annualSavings: 17,
    },
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_VIP_MONTHLY_PRICE_ID,
    stripeAnnualPriceId: process.env.NEXT_PUBLIC_STRIPE_VIP_ANNUAL_PRICE_ID,
  },
  model_pro: {
    id: "model_pro",
    name: "Model Pro",
    description: "For creators and models",
    pricing: {
      monthly: 29.99,
      annual: 299.99,
      annualSavings: 17,
    },
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_MODEL_PRO_MONTHLY_PRICE_ID,
    stripeAnnualPriceId: process.env.NEXT_PUBLIC_STRIPE_MODEL_PRO_ANNUAL_PRICE_ID,
  },
  family: {
    id: "family",
    name: "Family",
    description: "Share with up to 5 family members",
    pricing: {
      monthly: 24.99,
      annual: 249.99,
      annualSavings: 17,
    },
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_FAMILY_MONTHLY_PRICE_ID,
    stripeAnnualPriceId: process.env.NEXT_PUBLIC_STRIPE_FAMILY_ANNUAL_PRICE_ID,
    maxUsers: 5,
    badge: "Family",
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    description: "Enterprise solutions with custom support",
    pricing: {
      monthly: 99.99,
      annual: 999.99,
      annualSavings: 17,
    },
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_CORPORATE_MONTHLY_PRICE_ID,
    stripeAnnualPriceId: process.env.NEXT_PUBLIC_STRIPE_CORPORATE_ANNUAL_PRICE_ID,
    maxUsers: 100,
  },
}

/**
 * Get pricing for a specific tier and interval
 */
export function getTierPrice(
  tier: SubscriptionTier | null,
  interval: BillingInterval = "monthly"
): number {
  if (!tier || tier === "free") return 0
  return BILLING_TIERS[tier].pricing[interval]
}

/**
 * Get Stripe price ID for a tier and interval
 */
export function getStripePriceId(
  tier: SubscriptionTier,
  interval: BillingInterval = "monthly"
): string | undefined {
  const tierInfo = BILLING_TIERS[tier]
  if (interval === "monthly") {
    return tierInfo.stripeMonthlyPriceId
  } else {
    return tierInfo.stripeAnnualPriceId
  }
}

/**
 * Calculate annual savings percentage
 */
export function getAnnualSavings(tier: SubscriptionTier): number {
  return BILLING_TIERS[tier].pricing.annualSavings
}

/**
 * Get all available tiers for display
 */
export function getDisplayTiers(): BillingTierInfo[] {
  return Object.values(BILLING_TIERS).filter((tier) => tier.id !== "free")
}

/**
 * Get tier info by ID
 */
export function getTierInfo(tier: SubscriptionTier | null): BillingTierInfo {
  if (!tier || !BILLING_TIERS[tier]) {
    return BILLING_TIERS.free
  }
  return BILLING_TIERS[tier]
}
