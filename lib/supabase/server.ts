import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

let serverClient: ReturnType<typeof createServerClient> | null = null

export async function createClient() {
  if (serverClient) {
    return serverClient
  }

  try {
    const cookieStore = await cookies()
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      console.error("[v0] Missing Supabase environment variables on server")
      throw new Error("Missing Supabase configuration")
    }

    serverClient = createServerClient(url, key, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })

    return serverClient
  } catch (error) {
    console.error("[v0] Failed to initialize server Supabase client:", error)
    throw error
  }
}
