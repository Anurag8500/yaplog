"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error")
        setMessage("No verification token found.")
        return
      }

      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await res.json()

        if (res.ok && data.success) {
          setStatus("success")
        } else {
          setStatus("error")
          setMessage(data.error || "Verification failed.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Something went wrong. Please try again.")
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center shadow-2xl">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="w-12 h-12 border-4 border-neutral-700 border-t-white rounded-full animate-spin mx-auto" />
            <h1 className="text-2xl font-bold">Verifying email...</h1>
            <p className="text-neutral-400">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Email Verified!</h1>
            <p className="text-neutral-400">Your account has been successfully verified.</p>
            <Link href="/login">
              <button className="mt-4 px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors">
                Go to Login
              </button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Verification Failed</h1>
            <p className="text-red-400">{message}</p>
            <Link href="/signup">
              <button className="mt-4 px-6 py-2 bg-neutral-800 text-white rounded-lg font-medium hover:bg-neutral-700 transition-colors">
                Back to Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
