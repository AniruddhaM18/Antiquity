"use client";

import { Navbar } from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Link from "next/link";
import { HeroSection } from "@/src/components/HeroSection";
import Beams from "@/src/components/Beams";
import { FeaturesBento } from "@/src/components/FeaturesBento";
import BentoGridDeck from "@/src/components/ui/bento-grid";
import WorksDeck from "@/src/components/ui/work-grid";

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

       <BentoGridDeck />
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
        <WorksDeck />
      </section>
      <Footer />
    </div>
  );
}
