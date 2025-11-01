import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/lib/theme/theme-provider"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://ebonidating.com"),
  title: {
    default: "Eboni Dating - Find Love in the Black Community",
    template: "%s | Eboni Dating",
  },
  description:
    "Join thousands of Black singles worldwide finding love, friendship, and authentic connections. Verified members, smart matching, and secure messaging for the Black diaspora.",
  keywords: [
    "Black dating",
    "African dating",
    "Black singles",
    "African American dating",
    "Afro-Caribbean dating",
    "Black love",
    "dating app",
    "relationships",
    "connections",
    "Black community",
    "diaspora dating",
    "melanin dating",
  ],
  authors: [{ name: "Eboni Dating" }],
  creator: "Eboni Dating",
  publisher: "Eboni Dating",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ebonidating.com",
    siteName: "Eboni Dating",
    title: "Eboni Dating - Find Love in the Black Community",
    description:
      "Join thousands of Black singles worldwide finding love, friendship, and authentic connections in a culturally-rich environment.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eboni Dating - Black Dating Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eboni Dating - Find Love in the Black Community",
    description: "Join thousands of Black singles finding love and authentic connections.",
    images: ["/og-image.png"],
    creator: "@ebonidating",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  generator: "v0.app",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Eboni Dating",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#06b6d4",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://cdn.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="icon" href="/eboni-logo.png" />
        <link rel="apple-touch-icon" href="/eboni-logo.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-cyan-500 mx-auto" />
                    <p className="text-gray-600">Loading...</p>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        
        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful');
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>

        {/* Web Vitals Tracking */}
        <Script id="web-vitals" strategy="afterInteractive">
          {`
            function sendToAnalytics(metric) {
              const body = JSON.stringify(metric);
              const url = '/api/analytics';
              
              if (navigator.sendBeacon) {
                navigator.sendBeacon(url, body);
              } else {
                fetch(url, { body, method: 'POST', keepalive: true });
              }
            }
            
            if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
              try {
                const observer = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    sendToAnalytics({
                      name: entry.name,
                      value: entry.value || entry.duration,
                      rating: entry.rating,
                      delta: entry.delta,
                      id: entry.id,
                    });
                  }
                });
                observer.observe({ entryTypes: ['web-vitals'] });
              } catch (err) {
                console.log('Web Vitals observer error:', err);
              }
            }
          `}
        </Script>
      </body>
    </html>
  )
}
