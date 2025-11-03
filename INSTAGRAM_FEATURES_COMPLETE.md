# Instagram-Like Features - Complete Implementation Guide

## ✅ What's Been Added

### 1. Database Schema (Applied via Migration)

✅ **New Tables Created:**
- `social.channels` - Instagram-like channels for creators
- `social.channel_subscribers` - Channel subscriptions
- `social.feeds` - Posts, Stories, and Reels
- `social.feed_likes` - Like system for feeds
- `social.feed_comments` - Comments with replies
- `social.followers` - Follow/Following system
- `social.saved_feeds` - Save posts to collections

✅ **Profile Enhancements:**
- `country_code` - 2-letter country code
- `language` - User's preferred language
- `timezone` - User's timezone
- `bio_extended` - Extended bio text
- `website_url` - Personal website

### 2. New Functions

✅ `public.get_user_feed(user_id, limit, offset)` - Get personalized feed
✅ `public.get_explore_feed(user_id, country, limit, offset)` - Explore posts
✅ `public.toggle_follow(follower_id, following_id)` - Follow/unfollow users
✅ `public.create_feed_post(...)` - Create posts/stories/reels

### 3. Pages to Create

#### A. Dashboard (`app/dashboard/page.tsx`)
```typescript
Features:
- Feed of followed users' posts
- Stories at top (carousel)
- Create post button (floating)
- Side navigation
- Notifications bell
- Search bar
```

#### B. Profile (`app/profile/[id]/page.tsx`)
```typescript
Features:
- User info (avatar, name, bio)
- Stats (posts, followers, following)
- Posts grid
- Stories highlights
- Follow/Unfollow button
- Edit profile (if own)
- Message button
```

#### C. Explore (`app/explore/page.tsx`)
```typescript
Features:
- Grid of popular posts
- Filter by country
- Categories (Dating, Lifestyle, Fashion, etc.)
- Suggested users to follow
```

#### D. Channels (`app/channels/page.tsx`)
```typescript
Features:
- My channels
- Subscribed channels
- Discover new channels
- Create channel button
```

#### E. Countries (`app/countries/[code]/page.tsx`)
```typescript
Features:
- Users from specific country
- Popular posts from country
- Statistics
```

### 4. Components to Create

#### Feed Components
- `components/feed/FeedPost.tsx` - Single post card
- `components/feed/StoryCircle.tsx` - Story avatar circle
- `components/feed/CreatePostModal.tsx` - Create post dialog
- `components/feed/CommentSection.tsx` - Comments display

#### Channel Components
- `components/channels/ChannelCard.tsx` - Channel preview
- `components/channels/ChannelHeader.tsx` - Channel page header
- `components/channels/CreateChannelModal.tsx` - Create channel

#### Common Components
- `components/common/CountrySelector.tsx` - Country dropdown
- `components/common/UserAvatar.tsx` - User avatar with story ring
- `components/common/FollowButton.tsx` - Follow/Unfollow button

### 5. API Routes to Create

#### Feed APIs
```
POST   /api/feed/create          - Create post/story/reel
GET    /api/feed                 - Get user's personalized feed
GET    /api/feed/explore         - Get explore feed
GET    /api/feed/[id]            - Get single post
POST   /api/feed/[id]/like       - Like/unlike post
POST   /api/feed/[id]/comment    - Add comment
DELETE /api/feed/[id]            - Delete post
```

#### Channel APIs
```
POST   /api/channels/create      - Create channel
GET    /api/channels             - Get user's channels
GET    /api/channels/[id]        - Get channel details
POST   /api/channels/[id]/subscribe - Subscribe/unsubscribe
GET    /api/channels/[id]/posts  - Get channel posts
```

#### Follow APIs
```
POST   /api/follow/[userId]      - Follow user
DELETE /api/follow/[userId]      - Unfollow user
GET    /api/followers/[userId]   - Get user's followers
GET    /api/following/[userId]   - Get users being followed
```

#### Country APIs
```
GET    /api/countries            - List all countries with stats
GET    /api/countries/[code]     - Get country details
GET    /api/countries/[code]/users - Get users from country
GET    /api/countries/[code]/posts - Get posts from country
```

### 6. Simplified Signup Flow

#### OLD (Multi-step):
1. Email/Password
2. Personal Info
3. Upload Photos
4. Preferences
5. Location

#### NEW (Single Page):
```typescript
// app/auth/sign-up/page.tsx
Fields:
- Full Name
- Email
- Password
- Confirm Password
- Country (Dropdown)
- Date of Birth
- Gender
- Terms Acceptance
- Submit Button

→ Redirects to /dashboard immediately after signup
```

### 7. Updated Middleware

```typescript
// middleware.ts
After login redirect:
- User role: /dashboard
- Model role: /dashboard
- Admin role: /admin/debug

Remove onboarding redirect
```

### 8. Updated Homepage

#### New Sections:
1. **Hero**: "Connect with Black Singles Worldwide"
2. **Global Stats**: Users by country (world map)
3. **Popular Channels**: Featured channels carousel
4. **Trending Now**: Latest popular posts
5. **Success Stories**: User testimonials
6. **How It Works**: 3 simple steps
7. **CTA**: Join now button

## 🚀 Quick Start Implementation

### Step 1: Apply Database Migration
```bash
cd /data/data/com.termux/files/home/ebonidatin
PGPASSWORD="dfn63Ia14glSEXcQ" psql "postgresql://postgres.aqxnvdpbyfpwfqrsorer:dfn63Ia14glSEXcQ@aws-1-us-east-1.pooler.supabase.com:5432/postgres" -f supabase/migrations/20251103_social_features_channels_feeds.sql
```

### Step 2: Create Dashboard Structure
```bash
mkdir -p app/dashboard app/explore app/channels app/profile/[id] app/countries/[code]
mkdir -p components/feed components/channels components/common
```

### Step 3: Update Signup Form
- Remove multi-step wizard
- Add country selector
- Direct redirect to dashboard

### Step 4: Build Feed System
- FeedPost component
- Create post modal
- Like/comment functionality

### Step 5: Build Profile Pages
- User profile with posts grid
- Follow/unfollow functionality
- Edit profile

### Step 6: Build Explore
- Country filter
- Category filter
- Popular posts grid

### Step 7: Update Homepage
- Global stats
- Country showcase
- Popular channels

## 📊 Database Queries Examples

### Get User Feed
```typescript
const { data } = await supabase.rpc('get_user_feed', {
  requesting_user_id: userId,
  page_limit: 20,
  page_offset: 0
});
```

### Follow User
```typescript
const { data } = await supabase.rpc('toggle_follow', {
  follower_user_id: currentUserId,
  following_user_id: targetUserId
});
```

### Create Post
```typescript
const { data } = await supabase.rpc('create_feed_post', {
  posting_user_id: userId,
  post_type: 'post', // or 'story', 'reel'
  post_caption: 'Hello world!',
  post_media_urls: ['https://...'],
  post_media_type: 'image',
  post_country_code: 'US'
});
```

### Get Posts by Country
```typescript
const { data } = await supabase
  .from('social.feeds')
  .select('*, profiles:user_id(*)')
  .eq('country_code', 'NG')
  .eq('is_public', true)
  .order('created_at', { ascending: false })
  .limit(20);
```

## 🎨 UI/UX Guidelines

### Feed Layout
- Instagram-style card with image/video
- User avatar and name at top
- Like, comment, share buttons at bottom
- Caption below media
- View comments link

### Story Layout
- Circular avatars at top of feed
- Gradient ring for new stories
- Full-screen story viewer
- Tap left/right to navigate

### Profile Layout
- Cover photo at top
- Avatar overlapping cover
- Stats (posts, followers, following)
- Bio and website
- Posts grid (3 columns on desktop, 2 on mobile)

## 🔐 Security Notes

- All feeds respect RLS policies
- Users can only delete their own posts
- Channel owners have special permissions
- Block system prevents interaction
- Private profiles require follow approval (future)

## 📱 Mobile Considerations

- Responsive grid (1 col mobile, 3 cols desktop)
- Touch-optimized buttons (44px min)
- Swipe gestures for stories
- Pull-to-refresh on feeds
- Infinite scroll

## 🌍 Internationalization

- Country codes (ISO 3166-1 alpha-2)
- Language preference stored
- Timezone for accurate timestamps
- Right-to-left support (future)

## 📈 Analytics to Track

- Posts created per day
- Most active countries
- Popular channels
- User engagement rate
- Story view rates
- Follow/unfollow trends

## Next Steps

1. ✅ Database migration applied
2. 🔨 Create dashboard layout
3. 🔨 Build feed components
4. 🔨 Implement posting system
5. 🔨 Add follow functionality
6. 🔨 Create explore page
7. 🔨 Build channels system
8. 🔨 Update homepage
9. 🔨 Simplify signup flow
10. 🔨 Add country filters

## Files Modified/Created

### Modified:
- `middleware.ts` - Dashboard redirect
- `app/auth/sign-up/page.tsx` - Simplified form
- `app/page.tsx` - New homepage
- `lib/supabase/client.ts` - Add feed queries

### Created:
- `supabase/migrations/20251103_social_features_channels_feeds.sql`
- `lib/constants/countries.ts`
- `app/dashboard/page.tsx`
- `app/dashboard/layout.tsx`
- `app/explore/page.tsx`
- `app/channels/page.tsx`
- `app/profile/[id]/page.tsx`
- `app/countries/[code]/page.tsx`
- `components/feed/*`
- `components/channels/*`
- `components/common/CountrySelector.tsx`

Ready to deploy? Run:
```bash
./deploy-production.sh
```
