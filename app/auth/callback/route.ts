import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Auth callback received, code:', code ? 'present' : 'missing')

  if (code) {
    const supabase = createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      const redirectResponse = NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_failed`)
      // Add cache control headers
      redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
      redirectResponse.headers.set('Pragma', 'no-cache')
      return redirectResponse
    }
    
    console.log('Auth callback successful')
  } else {
    console.log('No code parameter found in callback')
    const redirectResponse = NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_code`)
    redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    redirectResponse.headers.set('Pragma', 'no-cache')
    return redirectResponse
  }

  // Redirect to dashboard after successful auth
  const redirectResponse = NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  redirectResponse.headers.set('Pragma', 'no-cache')
  return redirectResponse
}
