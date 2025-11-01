"use client"

import { useCallback } from "react"

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (callback: () => void) => void
        execute: (siteKey: string, options: { action: string }) => Promise<string>
      }
    }
  }
}

export function useRecaptcha() {
  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

    if (!siteKey) {
      console.warn("reCAPTCHA site key not configured")
      return null
    }

    try {
      if (typeof window === "undefined" || !window.grecaptcha?.enterprise) {
        console.warn("reCAPTCHA not loaded")
        return null
      }

      return new Promise((resolve) => {
        window.grecaptcha.enterprise.ready(async () => {
          try {
            const token = await window.grecaptcha.enterprise.execute(siteKey, { action })
            resolve(token)
          } catch (error) {
            console.error("reCAPTCHA execution error:", error)
            resolve(null)
          }
        })
      })
    } catch (error) {
      console.error("reCAPTCHA error:", error)
      return null
    }
  }, [])

  return { executeRecaptcha }
}
