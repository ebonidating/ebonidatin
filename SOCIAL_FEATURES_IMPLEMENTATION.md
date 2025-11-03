# Social Features Implementation Plan

## 🌍 International Access & Features

### Phase 1: Database Schema Updates

#### 1. Add Channels Table
```sql
CREATE TABLE IF NOT EXISTS social.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  category TEXT,
  is_public BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  subscribers_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_channels_owner ON social.channels(owner_id);
CREATE INDEX idx_channels_category ON social.channels(category);
CREATE INDEX idx_channels_subscribers ON social.channels(subscribers_count DESC);
```

#### 2. Add Channel Subscribers
```sql
CREATE TABLE IF NOT EXISTS social.channel_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES social.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  notification_enabled BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

CREATE INDEX idx_channel_subscribers_channel ON social.channel_subscribers(channel_id);
CREATE INDEX idx_channel_subscribers_user ON social.channel_subscribers(user_id);
```

#### 3. Add Feed/Stories Table
```sql
CREATE TABLE IF NOT EXISTS social.feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES social.channels(id) ON DELETE CASCADE,
  feed_type TEXT NOT NULL CHECK (feed_type IN ('post', 'story', 'reel')),
  caption TEXT,
  media_urls TEXT[] NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'mixed')),
  location TEXT,
  country TEXT,
  tags TEXT[],
  mentions UUID[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ, -- For stories
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feeds_user ON social.feeds(user_id, created_at DESC);
CREATE INDEX idx_feeds_channel ON social.feeds(channel_id, created_at DESC);
CREATE INDEX idx_feeds_country ON social.feeds(country, created_at DESC);
CREATE INDEX idx_feeds_type ON social.feeds(feed_type, created_at DESC);
CREATE INDEX idx_feeds_expires ON social.feeds(expires_at) WHERE expires_at IS NOT NULL;
```

#### 4. Update Profiles for Countries
```sql
ALTER TABLE core.profiles ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);
ALTER TABLE core.profiles ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';
ALTER TABLE core.profiles ADD COLUMN IF NOT EXISTS timezone TEXT;

CREATE INDEX idx_profiles_country_code ON core.profiles(country_code) WHERE country_code IS NOT NULL;
```

#### 5. Add Followers System
```sql
CREATE TABLE IF NOT EXISTS social.followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_followers_follower ON social.followers(follower_id);
CREATE INDEX idx_followers_following ON social.followers(following_id);
```

### Phase 2: New Pages & Components

#### 1. User Dashboard (`/dashboard/page.tsx`)
```typescript
Features:
- Feed view (all posts from followed users)
- Stories carousel at top
- Create post button
- Navigation to profile, channels, explore
- Notifications
- Direct messages
```

#### 2. Explore Page (`/explore/page.tsx`)
```typescript
Features:
- Browse by country
- Browse by category
- Trending posts
- Suggested users
- Suggested channels
```

#### 3. Channels Page (`/channels/page.tsx`)
```typescript
Features:
- My channels list
- Create new channel
- Subscribed channels
- Discover channels
```

#### 4. Profile Page (`/profile/[id]/page.tsx`)
```typescript
Features:
- Posts grid
- Stories highlights
- Followers/Following count
- Bio
- Edit profile (if own)
- Follow/Unfollow button
```

#### 5. Country Filter (`/countries/[code]/page.tsx`)
```typescript
Features:
- Show all users from specific country
- Popular posts from country
- Trending users
```

### Phase 3: Simplified Signup Flow

#### Remove Onboarding Steps
```typescript
// New signup flow:
1. Sign Up Page - Single form with:
   - Email
   - Password
   - Full Name
   - Country (dropdown)
   - Accept Terms
2. Email Verification
3. Redirect to Dashboard
```

### Phase 4: API Endpoints

#### Feed APIs
- `POST /api/feed/create` - Create post/story
- `GET /api/feed` - Get user feed
- `GET /api/feed/explore` - Get explore feed
- `GET /api/feed/country/:code` - Get country feed

#### Channel APIs
- `POST /api/channels/create` - Create channel
- `GET /api/channels` - Get user channels
- `POST /api/channels/:id/subscribe` - Subscribe to channel
- `GET /api/channels/:id/posts` - Get channel posts

#### Country APIs
- `GET /api/countries` - List all countries
- `GET /api/countries/:code/users` - Get users by country
- `GET /api/countries/:code/stats` - Get country statistics

#### Follow APIs
- `POST /api/follow/:userId` - Follow user
- `DELETE /api/follow/:userId` - Unfollow user
- `GET /api/followers/:userId` - Get followers
- `GET /api/following/:userId` - Get following

### Phase 5: Homepage Update

#### New Homepage Sections
1. Hero with global stats
2. Featured countries carousel
3. Popular channels
4. Trending posts
5. Success stories
6. How it works (simplified)

### Implementation Order

1. ✅ Database migrations (schema updates)
2. ✅ Simplified signup form
3. ✅ User dashboard with feed
4. ✅ Country selector and filtering
5. ✅ Channels system
6. ✅ Feed posting system
7. ✅ Follow system
8. ✅ Explore page
9. ✅ Updated homepage

## Files to Create/Update

### New Files
- `supabase/migrations/20251103_social_features.sql`
- `app/dashboard/page.tsx`
- `app/dashboard/layout.tsx`
- `app/explore/page.tsx`
- `app/channels/page.tsx`
- `app/channels/[id]/page.tsx`
- `app/profile/[id]/page.tsx`
- `app/countries/[code]/page.tsx`
- `app/api/feed/route.ts`
- `app/api/channels/route.ts`
- `app/api/follow/[userId]/route.ts`
- `components/feed/FeedPost.tsx`
- `components/feed/CreatePost.tsx`
- `components/channels/ChannelCard.tsx`
- `components/common/CountrySelector.tsx`

### Files to Update
- `app/auth/sign-up/page.tsx` - Simplify to single form
- `app/page.tsx` - New homepage with global features
- `middleware.ts` - Add dashboard redirect after login
- `lib/constants/countries.ts` - Country list

## Ready to implement?

Say "yes" to start implementation!
