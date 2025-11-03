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
