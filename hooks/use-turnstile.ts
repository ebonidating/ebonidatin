"use client"

import { useCallback } from "react"

export function useTurnstile() {
  const executeTurnstile = useCallback(async (action: string): Promise<string | null> => {
    // Return the token from the Turnstile widget
    // This will be handled by the Turnstile component itself
    return null
  }, [])

  return { executeTurnstile }
}
