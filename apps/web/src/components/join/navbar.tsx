"use client"
import LogoIcon from "@/components/ui/logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IoChevronBackOutline } from "react-icons/io5"

export default function JoinNavbar() {
  const router = useRouter()

  return (
    <nav className="min-h-16 w-screen bg-neutral-950 flex items-center font-inter border-b border-neutral-800 px-4">
      <Link href="/" className="flex items-center gap-2">
        <LogoIcon />
        <span className="text-neutral-300">Antiquity</span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => router.push("/dashboard")}
          className="h-8 px-3 rounded-sm flex items-center gap-2 text-sm text-neutral-300 bg-neutral-800 border border-neutral-700 hover:bg-neutral-800/80 transition"
        >
          <IoChevronBackOutline className="size-4" />
          Home
        </button>
      </div>
    </nav>
  )
}