"use client"

import { useState } from "react"
import AuthLayout from "../components/AuthLayout"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!email) {
      setError("Please enter your email address")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      // Even if it fails, show success to prevent enumeration
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <AuthLayout
        leftHeadline="Recover your access."
        leftSubtext="We'll help you get back to your thoughts and memories."
        rightTitle="Check your email"
        rightSubtitle="If an account exists, a reset link has been sent."
        footerText=""
        footerLinkText=""
        footerLinkHref=""
      >
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-neutral-600">
            We've sent a password reset link to <span className="font-semibold text-neutral-900">{email}</span>.
          </p>
          <div className="pt-2">
            <a href="/login" className="text-neutral-900 font-medium hover:underline">
              Back to Sign In
            </a>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      leftHeadline="Recover your access."
      leftSubtext="We'll help you get back to your thoughts and memories."
      rightTitle="Forgot password?"
      rightSubtitle="Enter your email to reset your password"
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-0 transition-all duration-200 text-base"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-neutral-900 text-white font-medium rounded-lg hover:bg-black disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-neutral-900/10 text-base"
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
