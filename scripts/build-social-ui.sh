#!/bin/bash

# Build Social Features UI - Complete Implementation
# This script creates all necessary frontend files

set -e

echo "🚀 Building Social Features UI..."
echo "================================="

cd "$(dirname "$0")/.."

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p app/dashboard
mkdir -p app/explore  
mkdir -p app/channels
mkdir -p "app/profile/[id]"
mkdir -p "app/countries/[code]"
mkdir -p components/feed
mkdir -p components/channels
mkdir -p components/common
mkdir -p app/api/feed
mkdir -p "app/api/follow/[userId]"
mkdir -p app/api/channels

echo "✅ Directories created"

# Update middleware to redirect to dashboard
echo "📝 Updating middleware..."
cat > middleware.ts << 'EOF'
import { createServerClient } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(request, response)
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect to dashboard after login
  if (session && request.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect to login if not authenticated
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
EOF

echo "✅ Middleware updated"

# Create basic dashboard
echo "📝 Creating dashboard..."
cat > app/dashboard/page.tsx << 'EOF'
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('core.profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Eboni Dating</h1>
            <div className="flex items-center gap-4">
              <a href="/explore" className="text-gray-600 hover:text-gray-900">Explore</a>
              <a href="/channels" className="text-gray-600 hover:text-gray-900">Channels</a>
              <a href={`/profile/${user.id}`} className="text-gray-600 hover:text-gray-900">Profile</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Welcome, {profile?.display_name || profile?.full_name}!
            </h2>
            <p className="text-gray-600 mb-4">
              Your personalized feed is ready. Start following users to see their posts here.
            </p>
            <div className="flex gap-4">
              <a
                href="/explore"
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Explore
              </a>
              <a
                href={`/profile/${user.id}`}
                className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Edit Profile
              </a>
            </div>
          </div>

          {/* Feed Placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Feed</h3>
            <p className="text-gray-600 text-center py-8">
              No posts yet. Follow some users to see their content here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Dashboard created"

# Create explore page
echo "📝 Creating explore page..."
cat > app/explore/page.tsx << 'EOF'
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const supabase = createClient();
  
  // Get popular posts
  const { data: posts } = await supabase
    .from('social.feeds')
    .select('*, profiles:user_id(*)')
    .eq('is_public', true)
    .order('likes_count', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore</h1>
        
        {/* Country Filter */}
        <div className="mb-6">
          <select className="px-4 py-2 rounded-lg border border-gray-300">
            <option value="">All Countries</option>
            <option value="US">🇺🇸 United States</option>
            <option value="GB">🇬🇧 United Kingdom</option>
            <option value="NG">🇳🇬 Nigeria</option>
            <option value="GH">🇬🇭 Ghana</option>
          </select>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <p className="text-sm text-gray-900 font-semibold">
                    {post.profiles?.display_name || 'User'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>{post.likes_count} likes</span>
                    <span>{post.comments_count} comments</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No posts yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Explore page created"

# Create simple profile page
echo "📝 Creating profile page..."
mkdir -p "app/profile/[id]"
cat > "app/profile/[id]/page.tsx" << 'EOF'
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const { data: profile } = await supabase
    .from('core.profiles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow p-8 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-amber-200 flex items-center justify-center text-3xl font-bold text-amber-700">
                {profile.display_name?.[0] || profile.full_name?.[0] || '?'}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.display_name || profile.full_name}
                </h1>
                <p className="text-gray-600 mt-1">{profile.bio}</p>
                <div className="flex gap-6 mt-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">0</span>
                    <span className="text-gray-600 ml-1">posts</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{profile.followers_count || 0}</span>
                    <span className="text-gray-600 ml-1">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{profile.following_count || 0}</span>
                    <span className="text-gray-600 ml-1">following</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Posts</h2>
            <p className="text-center text-gray-600 py-12">No posts yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Profile page created"

# Create channels page
echo "📝 Creating channels page..."
cat > app/channels/page.tsx << 'EOF'
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ChannelsPage() {
  const supabase = createClient();
  
  const { data: channels } = await supabase
    .from('social.channels')
    .select('*, profiles:owner_id(*)')
    .eq('is_public', true)
    .order('subscribers_count', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Channels</h1>
          <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg">
            Create Channel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels && channels.length > 0 ? (
            channels.map((channel: any) => (
              <div key={channel.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {channel.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{channel.subscribers_count} subscribers</span>
                  <button className="text-amber-600 hover:text-amber-700 font-semibold">
                    Subscribe
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No channels yet. Create the first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Channels page created"

echo ""
echo "✅ Social Features UI Build Complete!"
echo "======================================"
echo ""
echo "📝 Files Created:"
echo "  ✅ middleware.ts (updated)"
echo "  ✅ app/dashboard/page.tsx"
echo "  ✅ app/explore/page.tsx"
echo "  ✅ app/profile/[id]/page.tsx"
echo "  ✅ app/channels/page.tsx"
echo ""
echo "🚀 Next Steps:"
echo "  1. Review the created files"
echo "  2. Test locally with: pnpm run dev"
echo "  3. Deploy with: git push origin main"
echo ""
EOF

chmod +x scripts/build-social-ui.sh
echo "Build script created"
