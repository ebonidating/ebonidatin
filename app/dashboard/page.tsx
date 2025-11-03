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
