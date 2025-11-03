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
