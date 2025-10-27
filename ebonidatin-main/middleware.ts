import { updateSession } from "@/lib/supabase/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Admin route protection
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const supabase = await import("@/lib/supabase/server").then((mod) => mod.createClient())
    const {
      data: { user },
    } = await (await supabase).auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const { data: adminUser } = await (await supabase).from("admin_users").select("*").eq("user_id", user.id).single()

    if (!adminUser) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Protected user routes
  const protectedRoutes = ["/dashboard", "/discover", "/matches", "/messages", "/profile", "/onboarding"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute) {
    const supabase = await import("@/lib/supabase/server").then((mod) => mod.createClient())
    const {
      data: { user },
    } = await (await supabase).auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
