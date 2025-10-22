"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { useTranslations } from "@/lib/i18n/use-translations"

interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const { t } = useTranslations()

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle>{t.common.error}</CardTitle>
          </div>
          <CardDescription>{error?.message || t.errors.generic}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && process.env.NODE_ENV === "development" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 font-mono break-all">{error.message}</p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-red-600 cursor-pointer">Stack trace</summary>
                  <pre className="text-xs text-red-800 mt-2 overflow-auto">{error.stack}</pre>
                </details>
              )}
            </div>
          )}
          <div className="flex gap-2">
            {resetError && (
              <Button onClick={resetError} className="flex-1 bg-amber-600 hover:bg-amber-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            <Button variant="outline" onClick={() => (window.location.href = "/")} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
