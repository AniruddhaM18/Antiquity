"use client";

import Image from "next/image";
import logo from "../../public/Logoo.png";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 40);

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`
        fixed top-6 inset-x-0 z-50 flex justify-center
        transition-all duration-300 ease-out
        ${hidden ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"}
      `}
    >
      <div
        className={`
          w-[95%] max-w-7xl rounded-xl
          transition-all duration-300
          ${scrolled
            ? "border border-white/10 bg-[#0f1115]/30 backdrop-blur-md shadow-lg shadow-black/40"
            : "border-transparent bg-transparent shadow-none backdrop-blur-0"}
        `}
      >
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10 rounded-xl flex items-center justify-center">
              <Image src={logo} alt="Logo" width={400} height={400} />
            </div>
            <span className="text-2xl font-semibold text-slate-300 text-shadow-black/10 text-shadow-lg">
              Antiquity 
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/auth/signup" className="hidden md:block">
              <button className="neo-neutral">Sign in</button>
            </Link>
            <button className="neo-blue">Get Started</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
