"use client";

import { Navbar } from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Link from "next/link";
import { HeroSection } from "@/src/components/HeroSection";
import Beams from "@/src/components/Beams";
import { FeaturesBento } from "@/src/components/FeaturesBento";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Beams
          beamWidth={2.5}
          beamNumber={16}
          lightColor="#98a4f0"
          noiseIntensity={1.15}
          rotation={0}
        />
      </div>

      {/* FOREGROUND */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
      </div>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-neutral-200">
            Everything you need to engage
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Powerful features designed to make your contests interactive and memorable
          </p>
        </div>

        <FeaturesBento />
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-neutral-200">
            How it works
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Three simple steps to engage your audience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Create your contest",
              description: "Set up your contest in seconds. Choose questions, set timers, and customize settings.",
            },
            {
              step: "2",
              title: "Share the link",
              description: "Participants join instantly with a simple link. No downloads or sign-ups required.",
            },
            {
              step: "3",
              title: "Engage live",
              description: "Watch responses pour in real-time. See results update as participants answer.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center bg-neutral-900 p-8 rounded-2xl border border-neutral-800/40 shadow-[6px_6px_16px_rgba(0,0,0,0.8),-6px_-6px_16px_rgba(255,255,255,0.03)]"
            >
              <div className="w-14 h-14 rounded-xl mx-auto mb-6 flex items-center justify-center bg-perpdex text-white font-semibold text-lg shadow-[4px_4px_10px_rgba(87,106,231,0.4),-3px_-3px_8px_rgba(255,255,255,0.05)]">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-200">{item.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-neutral-200">
              Why choose Antiquity?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
              Built for creators, educators, and event organizers who want to make their audience part of the experience.
            </p>
            <ul className="space-y-4">
              {[
                "Zero friction for participants",
                "Beautiful, intuitive interface",
                "Real-time results and analytics",
                "Works on all devices",
                "Completely free to use",
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg flex-shrink-0 mt-0.5 flex items-center justify-center bg-perpdex shadow-[3px_3px_8px_rgba(87,106,231,0.3),-2px_-2px_6px_rgba(255,255,255,0.05)]">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-neutral-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-neutral-900 p-12 rounded-2xl border border-neutral-800/40 shadow-[6px_6px_16px_rgba(0,0,0,0.8),-6px_-6px_16px_rgba(255,255,255,0.03)] flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-neutral-400 text-sm font-medium mb-2">Live Analytics Dashboard</div>
              <div className="text-neutral-500 text-xs">Visual representation of real-time results</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center bg-neutral-900 p-12 md:p-16 rounded-2xl border border-neutral-800/40 shadow-[8px_8px_20px_rgba(0,0,0,0.9),-8px_-8px_20px_rgba(255,255,255,0.04)]">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-neutral-200">
            Ready to engage your audience?
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are making their events more interactive and memorable.
          </p>
          <Link href="/create">
            <button className="px-8 py-3.5 rounded-xl text-base font-medium bg-perpdex text-white hover:bg-[#4958be] shadow-[6px_6px_12px_rgba(87,106,231,0.3),-3px_-3px_8px_rgba(255,255,255,0.05)] hover:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.5),inset_-3px_-3px_8px_rgba(255,255,255,0.06)] transition-all duration-200 mb-4">
              Get started for free
            </button>
          </Link>
          <p className="text-sm text-neutral-500">No credit card required · Setup in 30 seconds</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
