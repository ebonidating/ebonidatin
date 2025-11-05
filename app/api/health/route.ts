import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      database: { status: 'unknown', responseTime: 0 },
      api: { status: 'healthy', responseTime: 0 },
    },
  };

  try {
    const startTime = Date.now();
    const supabase = await createClient();
    const { data, error } = await supabase.from('core.profiles').select('count').limit(1).single();
    
    const responseTime = Date.now() - startTime;
    
    checks.checks.database = {
      status: error ? 'unhealthy' : 'healthy',
      responseTime,
      ...(error && { error: error.message }),
    } as any;

    checks.status = error ? 'degraded' : 'healthy';

  } catch (error: any) {
    checks.checks.database = {
      status: 'unhealthy',
      responseTime: 0,
      ...(error && { error: error?.message || 'Unknown error' }),
    } as any;
    checks.status = 'unhealthy';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
