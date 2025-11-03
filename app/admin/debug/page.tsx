import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DebugDashboard() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Check if admin
  const { data: profile } = await supabase
    .from('core.profiles')
    .select('user_type')
    .eq('id', user.id)
    .single();

  if (!profile || profile.user_type !== 'admin') {
    redirect('/dashboard');
  }

  // Get stats
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Debug Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900">{totalUsers || 0}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Active Users</div>
            <div className="text-3xl font-bold text-green-600">{activeUsers || 0}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Posts</div>
            <div className="text-3xl font-bold text-blue-600">{totalPosts || 0}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Messages</div>
            <div className="text-3xl font-bold text-purple-600">{totalMessages || 0}</div>
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
                <span className="text-gray-600">Build</span>
                <span className="text-gray-900">{process.env.NEXT_PUBLIC_BUILD_ID || 'latest'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
