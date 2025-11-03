"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { EnhancedSignupForm } from "@/components/enhanced-signup-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-cyan-50 to-white">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-cyan-600 fill-cyan-600" />
            <span className="text-2xl font-bold text-gray-900">Eboni Dating</span>
          </Link>

          <EnhancedSignupForm />
        </div>
      </div>
    </div>
  )
}
