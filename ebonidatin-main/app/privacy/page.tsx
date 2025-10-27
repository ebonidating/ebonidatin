import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Eboni Dating protects your privacy and handles your data",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <header className="border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-yellow-400">Eboni Dating</span>
          </Link>
          <Button variant="ghost" asChild className="text-white hover:bg-white/10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="text-gray-300 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect information that you provide directly to us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Profile information (name, age, location, photos, bio)</li>
              <li>Account credentials (email, password)</li>
              <li>Communication data (messages, likes, matches)</li>
              <li>Usage data (how you interact with our platform)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Provide and improve our dating services</li>
              <li>Match you with compatible users</li>
              <li>Communicate with you about your account</li>
              <li>Ensure platform safety and security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your personal information. All data is
              encrypted in transit and at rest. We use secure authentication and regularly audit our security practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              For privacy-related questions or requests, contact us at{" "}
              <a href="mailto:privacy@ebonidating.com" className="text-yellow-400 hover:text-yellow-300">
                privacy@ebonidating.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
