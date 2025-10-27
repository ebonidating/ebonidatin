"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { EnhancedSignupForm } from "@/components/enhanced-signup-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-purple-900 to-black">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-yellow-400">Eboni Dating</span>
          </Link>

          <EnhancedSignupForm />
        </div>
      </div>
    </div>
  )
}
