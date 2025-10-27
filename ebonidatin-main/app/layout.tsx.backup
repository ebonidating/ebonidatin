import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://ebonidating.com"),
  title: {
    default: "Eboni Dating - Find Meaningful LGBTQ+ Connections",
    template: "%s | Eboni Dating",
  },
  description:
    "Join thousands of LGBTQ+ individuals finding love, friendship, and authentic connections in a safe, inclusive environment. Verified members, smart matching, and secure messaging.",
  keywords: [
    "LGBTQ+ dating",
    "gay dating",
    "lesbian dating",
    "queer dating",
    "transgender dating",
    "bisexual dating",
    "dating app",
    "relationships",
    "connections",
    "love",
    "inclusive dating",
    "safe dating",
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
    title: "Eboni Dating - Find Meaningful LGBTQ+ Connections",
    description:
      "Join thousands of LGBTQ+ individuals finding love, friendship, and authentic connections in a safe, inclusive environment.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eboni Dating - LGBTQ+ Dating Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eboni Dating - Find Meaningful LGBTQ+ Connections",
    description: "Join thousands of LGBTQ+ individuals finding love and authentic connections.",
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
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
