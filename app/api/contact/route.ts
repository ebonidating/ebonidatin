import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    const supabase = createClient();
    
    // Log contact submission
    await supabase.from('admin.audit_log').insert({
      action: 'contact_form_submission',
      new_data: { name, email, subject, message },
    });

    // TODO: Send email notification

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
