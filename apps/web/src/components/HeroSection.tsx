"use client"
import Link from "next/link";

//text-6xl text-neutral-700 text-shadow-black/10 text-shadow-lg tracking-tight
export async function HeroSection(){
    return (
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-inter font-medium mb-6 leading-tight text-neutral-200">
           Listen, learn and talk
            <br />
            <span className="text-violet-200">together</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Create interactive contests, quizzes, and polls
            <br />
            that captivate your audience.
            <br />
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create">
              <button className="px-8 py-3.5 border border-white/10 rounded-lg text-base font-medium bg-perpdex text-white hover:bg-[#4958be] shadow-[6px_6px_12px_rgba(87,106,231,0.3),-3px_-3px_8px_rgba(255,255,255,0.05)] hover:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.5),inset_-3px_-3px_8px_rgba(255,255,255,0.06)] transition-all duration-200">
                Get started for free
              </button>
            </Link>
            <button className="px-8 py-3.5  rounded-lg text-base font-medium bg-neutral-900 text-neutral-300 border border-neutral-800/50 shadow-[4px_4px_10px_rgba(0,0,0,0.8),-4px_-4px_10px_rgba(255,255,255,0.04)] hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.7),inset_-3px_-3px_6px_rgba(255,255,255,0.05)]  transition-all duration-200">
              Watch demo
            </button>
          </div>
        </div>
      </section>
    )
}