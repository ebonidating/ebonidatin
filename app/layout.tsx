import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/lib/theme/theme-provider"
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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </ErrorBoundary>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
