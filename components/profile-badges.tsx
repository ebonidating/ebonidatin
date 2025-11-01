"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, Star, Zap, Heart, Crown, Award, CheckCircle, Clock } from "lucide-react"

export type BadgeType = 
  | 'verified'
  | 'premium'
  | 'vip'
  | 'new_member'
  | 'active_today'
  | 'popular'
  | 'great_conversationalist'
  | 'photo_verified'

interface ProfileBadge {
  type: BadgeType
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const badgeConfig: Record<BadgeType, ProfileBadge> = {
  verified: {
    type: 'verified',
    label: 'Verified',
    icon: <Shield className="h-3 w-3" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-300',
  },
  premium: {
    type: 'premium',
    label: 'Premium',
    icon: <Star className="h-3 w-3" />,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100 border-amber-300',
  },
  vip: {
    type: 'vip',
    label: 'VIP',
    icon: <Crown className="h-3 w-3" />,
    color: 'text-purple-700',
    bgColor: 'bg-purple-100 border-purple-300',
  },
  new_member: {
    type: 'new_member',
    label: 'New',
    icon: <Zap className="h-3 w-3" />,
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-300',
  },
  active_today: {
    type: 'active_today',
    label: 'Active Today',
    icon: <Clock className="h-3 w-3" />,
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-100 border-cyan-300',
  },
  popular: {
    type: 'popular',
    label: 'Popular',
    icon: <Heart className="h-3 w-3 fill-current" />,
    color: 'text-pink-700',
    bgColor: 'bg-pink-100 border-pink-300',
  },
  great_conversationalist: {
    type: 'great_conversationalist',
    label: 'Great Chat',
    icon: <Award className="h-3 w-3" />,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100 border-indigo-300',
  },
  photo_verified: {
    type: 'photo_verified',
    label: 'Photo Verified',
    icon: <CheckCircle className="h-3 w-3" />,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100 border-emerald-300',
  },
}

interface ProfileBadgesProps {
  badges: BadgeType[]
  size?: 'sm' | 'md' | 'lg'
  maxDisplay?: number
}

export function ProfileBadges({ badges, size = 'md', maxDisplay }: ProfileBadgesProps) {
  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges
  const remainingCount = maxDisplay && badges.length > maxDisplay ? badges.length - maxDisplay : 0

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayBadges.map((badgeType) => {
        const badge = badgeConfig[badgeType]
        return (
          <Badge
            key={badgeType}
            variant="outline"
            className={`${badge.bgColor} ${badge.color} ${sizeClasses[size]} font-medium flex items-center gap-1`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </Badge>
        )
      })}
      {remainingCount > 0 && (
        <Badge
          variant="outline"
          className={`bg-gray-100 border-gray-300 text-gray-700 ${sizeClasses[size]} font-medium`}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}

// Helper function to get badges based on user data
export function getUserBadges(userData: {
  subscription_tier?: string
  email_verified?: boolean
  photo_verified?: boolean
  created_at?: string
  last_active?: string
  is_popular?: boolean
  message_response_rate?: number
}): BadgeType[] {
  const badges: BadgeType[] = []

  // Subscription badges
  if (userData.subscription_tier === 'vip') {
    badges.push('vip')
  } else if (userData.subscription_tier === 'premium') {
    badges.push('premium')
  }

  // Verification badges
  if (userData.email_verified) {
    badges.push('verified')
  }
  if (userData.photo_verified) {
    badges.push('photo_verified')
  }

  // Activity badges
  if (userData.last_active) {
    const lastActive = new Date(userData.last_active)
    const hoursSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60)
    if (hoursSinceActive < 24) {
      badges.push('active_today')
    }
  }

  // New member badge (joined within last 30 days)
  if (userData.created_at) {
    const createdAt = new Date(userData.created_at)
    const daysSinceJoined = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceJoined < 30) {
      badges.push('new_member')
    }
  }

  // Popular badge
  if (userData.is_popular) {
    badges.push('popular')
  }

  // Great conversationalist (response rate > 80%)
  if (userData.message_response_rate && userData.message_response_rate > 0.8) {
    badges.push('great_conversationalist')
  }

  return badges
}
