export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50 to-white">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-amber-600 mx-auto" />
        <p className="text-gray-600 font-medium">Setting up your profile...</p>
      </div>
    </div>
  )
}
