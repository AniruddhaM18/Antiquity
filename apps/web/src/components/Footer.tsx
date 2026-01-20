"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../public/Logoo.png";
import { FaSquareGithub, FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import LogoIcon from "@/components/ui/logo";

export default function Footer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const gradient = "bg-clip-text text-transparent bg-linear-to-b from-neutral-300 via-indigo-200/90 to-[#1e1b4b]"

  return (
    <footer className="mt-40 text-neutral-300 bg-gradient-to-t from-[#576ae7]/30 via-[#4958be]/20 to-black border-t border-neutral-700"
>
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center pt-24">
          <div
            className=" w-20 h-20 rounded-3xl flex items-center justify-center
              shadow-[inset_3px_3px_8px_rgba(0,0,0,0.9),inset_-3px_-3px_8px_rgba(255,255,255,0.06)]
            ">
            <LogoIcon size={80} />
          </div>

          <div className="flex gap-6 text-mithai/75">
            <FaSquareGithub className="w-8 h-8 hover:text-mithai transition" />
            <SiGmail className="w-8 h-8 hover:text-mithai transition" />
            <FaLinkedin className="w-8 h-8 hover:text-mithai transition" />
            <FaSquareXTwitter className="w-8 h-8 hover:text-mithai transition" />
          </div>
        </div>


        <div className="flex justify-center pt-26 overflow-visible">
          <h1 className="text-[22vw] leading-[1.15] font-medium whitespace-nowrap flex">
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
                inline-block transition-transform duration-700 ease-out
                ${show ? "-translate-y-8" : "translate-y-0"}
              `}
            >
              t
            </span>

            {/* y */}
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

        {/* Bottom */}
        <div className="flex justify-between items-center py-10 text-sm text-neutral-500">
          <span>Antiquity by Aniruddha · Inspired by Matiks</span>
          <span>© 2026 AntiCutie 💜</span>
        </div>
      </div>
    </footer>
  );
}
