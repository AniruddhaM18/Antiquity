import { cn } from "@/lib/utils";
import React from "react";

import {
  IconArrowWaveRightUp,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconBulb,
} from "@tabler/icons-react";

import { VscGraph } from "react-icons/vsc";
import { IoMdSearch } from "react-icons/io";



const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-6 md:auto-rows-[22rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-neutral-200 bg-white p-6 transition duration-200 hover:shadow-xl dark:border-neutral-700/40 dark:bg-black dark:shadow-none",
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mt-2 mb-2 font font-semibold text-neutral-600 dark:text-orange-100">
          {title}
        </div>
        <div className="font text-xs font-normal text-orange-200/80">
          {description}
        </div>
      </div>
    </div>
  );
};


const SkeletonBase = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <div
    className="
      flex flex-1 w-full h-full min-h-[8rem] rounded-xl
      bg-gradient-to-t
      from-[#ea580c]/10
      via-[#c2410c]/14
      to-neutral-950
      relative overflow-hidden p-6
    "
  >
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {icon}
      <p className="text-neutral-300 text-sm font-medium mt-3">
        {title}
      </p>
      <p className="text-orange-200 text-xs mt-1">
        {subtitle}
      </p>
    </div>
  </div>
);


const SkeletonOne = () => (
  <SkeletonBase
    icon={<IoMdSearch className="h-12 w-12 text-orange-400/80" />}
    title="Transform Ideas"
    subtitle="Into Reality"
  />
);

const SkeletonTwo = () => (
  <SkeletonBase
    icon={<VscGraph className="h-12 w-12 text-orange-400/80" />}
    title="Launch Fast"
    subtitle="Build Better"
  />
);

const SkeletonThree = () => (
  <SkeletonBase
    icon={<IconBulb className="h-12 w-12 text-orange-400/80" />}
    title="Innovate Daily"
    subtitle="Think Different"
  />
);



const items = [
  {
    title: "The Power of Communication",
    description:
      "Understand the impact of effective communication in our lives.",
    header: <SkeletonOne />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Pursuit of Knowledge",
    description: "Join the quest for understanding and enlightenment.",
    header: <SkeletonTwo />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Joy of Creation",
    description: "Experience the thrill of bringing ideas to life.",
    header: <SkeletonThree />,
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  },
];



export default function BentoGridSingleRow() {
  return (
    <BentoGrid className="max-w-6xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}
