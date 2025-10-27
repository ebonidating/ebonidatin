import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Eboni Dating - Find Authentic Black Love & Build Connections',
  description: 'Join thousands of Black singles worldwide in a safe, culturally-rich dating community.',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        <div className="min-h-screen w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
