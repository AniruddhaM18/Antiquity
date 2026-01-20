"use client"
import Image from "next/image"

import { HiMiniCubeTransparent } from "react-icons/hi2";

import LogoIcon from "@/components/ui/logo";

export function QuizNavbar() {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-neutral-800 bg-neutral-950">
      <div className="flex items-center justify-center text-lg font-semibold text-neutral-300 gap-2">
        <div className=" text-purple-300 w-12 h-12 rounded-sm flex items-center justify-center shrink-0">
        <LogoIcon />
        </div>
        Antiquity
      </div>

      <div className="flex items-center gap-3">
        <button className="px-3 py-1.5 text-sm border border-neutral-700 rounded hover:bg-neutral-800">
          Save Quiz
        </button>
        <button className="px-3 py-1.5 text-sm bg-perpdex rounded text-white hover:bg-dankdex">
          Launch 
        </button>
      </div>
    </header>
  )
}
