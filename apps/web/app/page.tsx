"use client";

import { Navbar } from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-neutral-200 relative">
      <Navbar />

      {/* HERO */}
      <section className="h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h1 className="text-4xl md:text-7xl font-semibold text-perpdex mb-6">
            CONTEST KHELENGA LAADLEEEEEE
          </h1>

          <p className="text-neutral-400 font-light">
            Play contest to lose your context
          </p>

          <div className="mt-10 text-neutral-500">HOORAY</div>
        </div>
      </section>

      {/* FEATURE */}
      <section className="max-w-[90rem] mx-auto px-8 py-32">
        <div
          className="
            rounded-[2.5rem] p-16 bg-[#0f1115]
            shadow-[12px_12px_30px_rgba(0,0,0,0.85),-12px_-12px_30px_rgba(255,255,255,0.04)]
          "
        >
          <h2 className="text-5xl font-bold mb-6">Make anything</h2>

          <p className="text-xl text-neutral-400 mb-10 max-w-3xl">
            AI landing page builder that creates stunning designs in seconds.
          </p>

          <ul className="space-y-5">
            {[
              "Intelligent code completion",
              "Real-time AI suggestions",
              "Seamless workflow integration",
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-perpdex" />
                <span className="text-neutral-300">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
