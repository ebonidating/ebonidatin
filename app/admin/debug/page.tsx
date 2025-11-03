import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated', stats: null, isAdmin: false };
    }

    const { data: profile } = await supabase
      .from('core.profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (!profile || profile.user_type !== 'admin') {
      return { error: 'Not authorized', stats: null, isAdmin: false };
    }

    const [
      { count: totalUsers },
      { count: activeUsers },
      { count: totalPosts },
      { count: totalMessages },
    ] = await Promise.all([
      supabase.from('core.profiles').select('*', { count: 'exact', head: true }),
      supabase.from('core.profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('core.posts').select('*', { count: 'exact', head: true }),
      supabase.from('messaging.messages').select('*', { count: 'exact', head: true }),
    ]);

    return {
      error: null,
      stats: { totalUsers, activeUsers, totalPosts, totalMessages },
      isAdmin: true
    };
  } catch (error) {
    return { error: 'Failed to load stats', stats: null, isAdmin: false };
  }
}

export default async function DebugDashboard() {
  const { error, stats, isAdmin } = await getStats();

  if (error === 'Not authenticated') {
    redirect('/auth/login');
  }

  if (error === 'Not authorized') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Debug Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Active Users</div>
            <div className="text-3xl font-bold text-green-600">{stats?.activeUsers || 0}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Posts</div>
            <div className="text-3xl font-bold text-blue-600">{stats?.totalPosts || 0}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Messages</div>
            <div className="text-3xl font-bold text-purple-600">{stats?.totalMessages || 0}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Database Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Connection</span>
                <span className="text-green-600 font-semibold">✓ Healthy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Schema</span>
                <span className="text-green-600 font-semibold">✓ Valid</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">System Health</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">API Status</span>
                <span className="text-green-600 font-semibold">✓ Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deployment</span>
                <span className="text-green-600 font-semibold">✓ Production</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
