"use client";

import { useEffect, useState } from "react";

import { FaSquareGithub, FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import LogoIcon from "@/components/ui/logo";

export default function Footer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const gradient =
    "bg-clip-text text-transparent bg-linear-to-b from-neutral-200 via-orange-300/90 to-[#7c2d12]";

  return (
    <footer className="
      mt-40 text-neutral-300
      bg-gradient-to-t
      from-[#ea580c]/25
      via-[#c2410c]/15
      to-black
      border-t border-neutral-900/10
    ">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top */}
        <div className="flex justify-between items-center pt-28">
          <div
            className="
              w-20 h-20 rounded-3xl flex items-center justify-center
              shadow-[inset_3px_3px_8px_rgba(0,0,0,0.9),inset_-3px_-3px_8px_rgba(255,180,120,0.08)]
            "
          >
            <LogoIcon size={80} />
          </div>

          <div className="flex gap-6 text-orange-200/70">
            <FaSquareGithub className="w-8 h-8 hover:text-orange-100 transition" />
            <SiGmail className="w-8 h-8 hover:text-orange-100 transition" />
            <FaLinkedin className="w-8 h-8 hover:text-orange-100 transition" />
            <FaSquareXTwitter className="w-8 h-8 hover:text-orange-100 transition" />
          </div>
        </div>

        {/* Brand */}
        <div className="flex justify-center pt-26 overflow-visible">
          <h1 className="text-[22vw] leading-[1.15] font-medium whitespace-nowrap flex tracking-tight">
            {"Antiqui".split("").map((char, i) => (
              <span key={i} className={gradient}>
                {char}
              </span>
            ))}

            <span
              className={`
                ${gradient}
                inline-block transition-transform duration-700 ease-out
                ${show ? "-translate-y-8" : "translate-y-0"}
              `}
            >
              t
            </span>

            <span
              className={`
                ${gradient}
                inline-block transition-transform duration-700 ease-out delay-150
                ${show ? "-translate-y-16" : "translate-y-0"}
              `}
            >
              y
            </span>
          </h1>
        </div>

</div> 

<div className="flex justify-between items-center pb-4 pt-16 px-10 text-sm text-orange-100/80">
  <span>Antiquity by Aniruddha · Inspired by Matiks</span>
  <span>© 2026 AntiCutie 🧡</span>
</div>
    </footer>
  );
}
