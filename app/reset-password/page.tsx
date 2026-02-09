"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import AuthLayout from "../components/AuthLayout"
import { Eye, EyeOff } from "lucide-react"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!token) {
      setError("Invalid or missing reset token")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-neutral-900">Password Reset Complete</h3>
        <p className="text-neutral-600">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>
        <div className="pt-4">
          <a
            href="/login"
            className="inline-flex items-center justify-center w-full h-14 bg-neutral-900 text-white font-medium rounded-lg hover:bg-black transition-all duration-200"
          >
            Sign In Now
          </a>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="text-center text-red-500">
        Invalid or missing reset token. Please request a new password reset link.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-0 transition-all duration-200 text-base pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-0 transition-all duration-200 text-base pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-neutral-900 text-white font-medium rounded-lg hover:bg-black disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-neutral-900/10 text-base"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      leftHeadline="Secure your mind."
      leftSubtext="Create a strong password to keep your thoughts private."
      rightTitle="Reset Password"
      rightSubtitle="Enter your new password below"
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}
