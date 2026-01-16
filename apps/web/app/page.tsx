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
      <section className="max-w-6xl mx-auto px-6 py-36">
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
      <Footer />
    </div>
  );
}
