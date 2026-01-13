"use client"

import { useState } from "react"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient()

export default function SignupPage() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const { error } = await authClient.signUp.email({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      callbackURL: "/",
    })

    if (error) {
      console.error(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div
        className="
          w-full max-w-md rounded-2xl p-8
          bg-neutral-900 text-neutral-100
          shadow-[12px_12px_24px_rgba(0,0,0,0.8),-12px_-12px_24px_rgba(38,38,38,0.4)]
        "
      >
        <h1 className="text-2xl font-thin text-center mb-6">
             Create Antiquity 
        </h1>

        {/* EMAIL SIGNUP */}
        <form onSubmit={onSubmit}>
          <Input label="Name" name="name" />
          <Input label="Email" name="email" type="email" />
          <Input label="Password" name="password" type="password" />

          <button
            type="submit"
            disabled={loading}
            className="zinc-sub
              mt-8 w-full py-3 rounded-xl font-medium
              bg-neutral-900
              shadow-[6px_6px_12px_rgba(0,0,0,0.8),-6px_-6px_12px_rgba(38,38,38,0.35)]
              transition-all
              hover:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.85),inset_-6px_-6px_12px_rgba(38,38,38,0.35)]
              disabled:opacity-60
            "
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-neutral-800" />
          <span className="text-xs text-neutral-500">OR</span>
          <div className="h-px flex-1 bg-neutral-800" />
        </div>

        {/* GOOGLE SIGNUP */}
        <button
          type="button"
          onClick={() =>
            authClient.signIn.social({
              provider: "google",
              callbackURL: "/",
            })
          }
          className="zinc-sub
            w-full py-3 rounded-xl font-medium
            flex items-center justify-center gap-3
            bg-neutral-900
            shadow-[6px_6px_12px_rgba(0,0,0,0.8),-6px_-6px_12px_rgba(38,38,38,0.35)]
            transition-all
            hover:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.85),inset_-6px_-6px_12px_rgba(38,38,38,0.35)]
            active:scale-[0.98]
          "
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>
    </div>
  )
}

/* ---------- Components ---------- */

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="mb-4">
      <label className="text-sm text-neutral-400 mb-1 block">
        {label}
      </label>
      <input
        {...props}
        required
        className="
          w-full rounded-xl px-4 py-2
          bg-neutral-900 text-neutral-100
          outline-none
          shadow-[inset_6px_6px_12px_rgba(0,0,0,0.85),inset_-6px_-6px_12px_rgba(38,38,38,0.35)]
        "
      />
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.3 35.5 26.8 36 24 36c-5.3 0-9.7-3.5-11.3-8.3l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.1-2.3 3.9-4.3 5.2l6.3 5.2C39.6 35.4 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  )
}
