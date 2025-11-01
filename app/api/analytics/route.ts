import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

// In-memory store for analytics (use a database in production)
const analytics: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();
    
    // Store metric
    analytics.push({
      ...metric,
      timestamp: Date.now(),
      userAgent: request.headers.get("user-agent"),
      url: request.headers.get("referer"),
    });

    // Keep only last 1000 metrics
    if (analytics.length > 1000) {
      analytics.shift();
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record metric" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    count: analytics.length,
    metrics: analytics.slice(-100) 
  });
}
