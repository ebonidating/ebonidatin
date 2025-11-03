import { createServerClient } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(request, response)
  const { data: { session } } = await supabase.auth.getSession()

  // Protect dashboard routes - require authentication
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect explore, channels, profile routes
  if (!session && (
    request.nextUrl.pathname.startsWith('/explore') ||
    request.nextUrl.pathname.startsWith('/channels') ||
    request.nextUrl.pathname.startsWith('/profile')
  )) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
