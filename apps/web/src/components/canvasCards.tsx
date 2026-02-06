"use client";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "./ui/canvas-reveal-effect";
import LogoIcon from "@/components/ui/logo";

export function CanvasRevealEffectDemo() {
  return (
    <div className="py-20 flex flex-col lg:flex-row items-center justify-center bg-black w-full gap-4 mx-auto px-8">

      {/* LEFT */}
      <Card
        title="Create a Quiz"
        description="Quickly create and configure your quiz."
        icon={<LogoIcon size={80} />}
      >
        <CanvasRevealEffect
          animationSpeed={4}
          containerClassName="bg-black"
          colors={[[251, 146, 60]]}
          dotSize={2}
        />
      </Card>

      {/* CENTER */}
      <Card
        title="Add Questions & Go Live"
        description="Add questions and start live contest instantly."
        icon={<LogoIcon size={80}  />}
      >
        <CanvasRevealEffect
          animationSpeed={5}
          containerClassName="bg-black"
          colors={[
            [249, 115, 22],
            [234, 88, 12],
          ]}
          dotSize={2}
        />
      </Card>

      {/* RIGHT */}
      <Card
        title="Share Code & Invite"
        description="Share join code and let users participate."
        icon={<LogoIcon size={80} />}
      >
        <CanvasRevealEffect
          animationSpeed={4}
          containerClassName="bg-black"
          colors={[[251, 146, 60]]}
          dotSize={2}
        />
      </Card>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   CARD                                     */
/* -------------------------------------------------------------------------- */

const Card = ({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-white/[0.2] group/canvas-card flex items-center justify-center max-w-sm w-full mx-auto p-4 relative h-[30rem]"
    >
      {/* Corner Decorations */}
      <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />

      {/* Hover Canvas */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENT */}
      <div className="relative z-20 flex items-center justify-center w-full h-full">

        {/* CENTERED LOGO */}
        <div className="absolute inset-0 flex items-center justify-center transition duration-300 group-hover/canvas-card:opacity-0 group-hover/canvas-card:-translate-y-6">
          {icon}
        </div>

        {/* HOVER TEXT */}
        <div className="text-center opacity-0 group-hover/canvas-card:opacity-100 transition duration-300">

          <h2 className="text-white text-xl font-bold mb-2 -translate-y-4 group-hover/canvas-card:translate-y-0 transition duration-300">
            {title}
          </h2>

          <p className="text-neutral-300 text-sm -translate-y-2 group-hover/canvas-card:translate-y-0 transition duration-300">
            {description}
          </p>

        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    ICON                                    */
/* -------------------------------------------------------------------------- */

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
