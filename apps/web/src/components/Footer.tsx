"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../public/anbw.png";
import { FaSquareGithub, FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const gradient =
    "bg-clip-text text-transparent bg-linear-to-b from-neutral-300 via-neutral-200 to-neutral-600";

  return (
    <footer className="bg-[#0f1115] text-neutral-300 mt-40">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top */}
        <div className="flex justify-between items-center pt-24">
          <div
            className="
              w-20 h-20 rounded-3xl flex items-center justify-center
              shadow-[inset_3px_3px_8px_rgba(0,0,0,0.9),inset_-3px_-3px_8px_rgba(255,255,255,0.06)]
            "
          >
            <Image src={logo} alt="Logo" width={80} height={80} />
          </div>

          <div className="flex gap-6 text-mithai/75">
            <FaSquareGithub className="w-8 h-8 hover:text-mithai transition" />
            <SiGmail className="w-8 h-8 hover:text-mithai transition" />
            <FaLinkedin className="w-8 h-8 hover:text-mithai transition" />
            <FaSquareXTwitter className="w-8 h-8 hover:text-mithai transition" />
          </div>
        </div>

        {/* TITLE — CORRECT WAY */}
        <div className="flex justify-center pt-26 pb-12 overflow-visible">
          <h1
            className="
              text-[22vw]
              leading-[1.15]
              font-medium
              whitespace-nowrap
              flex
            "
          >
            {/* Antiqui */}
            {"Antiqui".split("").map((char, i) => (
              <span key={i} className={`${gradient}`}>
                {char}
              </span>
            ))}

            {/* t */}
            <span
              className={`
                ${gradient}
                inline-block
                transition-transform duration-700 ease-out
                ${show ? "-translate-y-8" : "translate-y-0"}
              `}
            >
              t
            </span>

            {/* y */}
            <span
              className={`
                ${gradient}
                inline-block
                transition-transform duration-700 ease-out delay-150
                ${show ? "-translate-y-16" : "translate-y-0"}
              `}
            >
              y
            </span>
          </h1>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center py-10 text-sm text-neutral-500">
          <span>Antiquity by Aniruddha · Inspired by Matiks</span>
          <span>© 2026 AntiCutie ❤️</span>
        </div>
      </div>
    </footer>
  );
}
