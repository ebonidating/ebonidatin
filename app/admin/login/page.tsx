import { AdminLoginForm } from "@/components/admin-login-form"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 mb-4">
            <Shield className="h-8 w-8 text-cyan-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access the Eboni Dating admin dashboard</p>
        </div>

        <AdminLoginForm />

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-cyan-600 hover:text-cyan-700">
            ← Back to main site
          </Link>
        </div>
      </div>
    </div>
  )
}
