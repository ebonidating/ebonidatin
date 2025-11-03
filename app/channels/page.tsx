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
