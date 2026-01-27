"use client"

export default function JoinLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-neutral-800 border-t-orange-500 rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-orange-400 rounded-full animate-spin" style={{ animationDirection: 'alternate', animationDuration: '0.8s' }} />
      </div>
      <p className="text-sm text-orange-200">Loading contest...</p>
    </div>
  )
}