import Image from "next/image";
import logo from "../../public/anbw.png";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="relative top-0 inset-x-0 z-50
        bg-[#0f1115]/20
        backdrop-blur-lg
        supports-[backdrop-filter]:bg-[#0f1115]/60]">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center p-1
            shadow-[inset_2px_2px_6px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(255,255,255,0.06)]">
            <Image src={logo} alt="Logo" width={40} height={40} />
          </div>
          <span className="text-xl font-semibold text-neutral-200">
            Antiquity
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
        {/* Button */}
        <Link href="/auth/signup" className="hidden md:block">
          <button
            className="gray-button">
            Sign in
          </button>
        </Link>
         <button className="neom-button">
            Get Started
          </button>
      </div>
      </div>
    </nav>
  );
}
