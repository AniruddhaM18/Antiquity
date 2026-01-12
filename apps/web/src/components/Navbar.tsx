import Image from "next/image";
import logo from "../../public/anbw.png";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className=" top-0 inset-x-0 z-50 bg-[#0f1115]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

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

        <div className="flex items-center justify-between">
        {/* Button */}
        <Link href="/auth/signup" className="hidden md:block">
          <button
            className="
              px-4 py-2 rounded-lg text-sm font-medium mr-6
              bg-[#0f1115] text-mithai
              shadow-[4px_4px_10px_rgba(0,0,0,0.9),-4px_-4px_10px_rgba(255,255,255,0.05)]
              hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.06)]
              active:scale-[0.98]
              transition-all duration-150
            "
          >
            Sign in
          </button>
        </Link>
         <button className="neo-btn">
            Get Started
          </button>
      </div>
      </div>
    </nav>
  );
}
