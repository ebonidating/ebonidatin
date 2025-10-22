export type SubscriptionTier = "free" | "premium" | "vip" | "model_pro"

export interface TierFeatures {
  name: string
  price: number
  features: Record<string, boolean>
}

export const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  free: {
    name: "Free",
    price: 0,
    features: {
      createProfile: true,
      browseProfiles: true,
      likeProfiles: true,
      seeMatches: true,
      sendMessages: false,
      unlimitedMessaging: false,
      seeWhoLikedYou: false,
      videoCalls: false,
      advancedFilters: false,
      superLikes: false,
      rewind: false,
      incognitoMode: false,
      passport: false,
      profileBoost: false,
      verifiedBadge: false,
      portfolioShowcase: false,
      bookingSystem: false,
      modelVerification: false,
      premiumContent: false,
      virtualGifts: false,
      prioritySupport: false,
    },
  },
  premium: {
    name: "Premium",
    price: 9.99,
    features: {
      createProfile: true,
      browseProfiles: true,
      likeProfiles: true,
      seeMatches: true,
      sendMessages: true,
      unlimitedMessaging: true,
      seeWhoLikedYou: true,
      videoCalls: true,
      advancedFilters: true,
      superLikes: true,
      rewind: true,
      incognitoMode: false,
      passport: false,
      profileBoost: true,
      verifiedBadge: false,
      portfolioShowcase: false,
      bookingSystem: false,
      modelVerification: false,
      premiumContent: false,
      virtualGifts: true,
      prioritySupport: false,
    },
  },
  vip: {
    name: "VIP",
    price: 19.99,
    features: {
      createProfile: true,
      browseProfiles: true,
      likeProfiles: true,
      seeMatches: true,
      sendMessages: true,
      unlimitedMessaging: true,
      seeWhoLikedYou: true,
      videoCalls: true,
      advancedFilters: true,
      superLikes: true,
      rewind: true,
      incognitoMode: true,
      passport: true,
      profileBoost: true,
      verifiedBadge: true,
      portfolioShowcase: false,
      bookingSystem: false,
      modelVerification: false,
      premiumContent: true,
      virtualGifts: true,
      prioritySupport: true,
    },
  },
  model_pro: {
    name: "Model Pro",
    price: 29.99,
    features: {
      createProfile: true,
      browseProfiles: true,
      likeProfiles: true,
      seeMatches: true,
      sendMessages: true,
      unlimitedMessaging: true,
      seeWhoLikedYou: true,
      videoCalls: true,
      advancedFilters: true,
      superLikes: true,
      rewind: true,
      incognitoMode: true,
      passport: true,
      profileBoost: true,
      verifiedBadge: true,
      portfolioShowcase: true,
      bookingSystem: true,
      modelVerification: true,
      premiumContent: true,
      virtualGifts: true,
      prioritySupport: true,
    },
  },
}

export function hasFeature(tier: SubscriptionTier | null, feature: string): boolean {
  if (!tier) return TIER_FEATURES.free.features[feature] ?? false
  return TIER_FEATURES[tier].features[feature] ?? false
}

export function getTierName(tier: SubscriptionTier | null): string {
  if (!tier) return TIER_FEATURES.free.name
  return TIER_FEATURES[tier].name
}

export function getTierPrice(tier: SubscriptionTier | null): number {
  if (!tier) return TIER_FEATURES.free.price
  return TIER_FEATURES[tier].price
}
