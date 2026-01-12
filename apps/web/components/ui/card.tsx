import * as React from "react"
import { cn } from "@/lib/utils"

/* ───────────────── Card ───────────────── */

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        `
        bg-neutral-900
        text-neutral-100
        flex flex-col gap-6
        rounded-2xl
        py-6

        /* Default = pressed (inset neumorphism) */
        shadow-[inset_6px_6px_12px_rgba(0,0,0,0.8),inset_-6px_-6px_12px_rgba(255,255,255,0.06)]

        /* Keep hover visually identical */
        hover:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.8),inset_-6px_-6px_12px_rgba(255,255,255,0.06)]

        /* Subtle smoothing only (no visual jump) */
        transition-shadow
        duration-200
        ease-out
        `,
        className
      )}
      {...props}
    />
  );
}

//normal- not pressed css

// function Card({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card"
//       className={cn(
//         `
//         bg-neutral-900
//         text-neutral-100
//         flex flex-col gap-6
//         rounded-2xl
//         py-6

//         /* Default = raised neumorphism */
//         shadow-[6px_6px_14px_rgba(0,0,0,0.85),-6px_-6px_14px_rgba(255,255,255,0.05)]

//         /* Hover = very subtle soften (no pop) */
//         hover:shadow-[4px_4px_12px_rgba(0,0,0,0.8),-4px_-4px_12px_rgba(255,255,255,0.06)]

//         /* Smooth only */
//         transition-shadow
//         duration-200
//         ease-out
//         `,
//         className
//       )}
//       {...props}
//     />
//   );
// }

/* ───────────────── Header ───────────────── */

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        `
        @container/card-header
        grid auto-rows-min grid-rows-[auto_auto]
        items-start gap-2 px-6
        has-data-[slot=card-action]:grid-cols-[1fr_auto]
        `,
        className
      )}
      {...props}
    />
  )
}




/* ───────────────── Title ───────────────── */

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base font-medium leading-none text-neutral-100",
        className
      )}
      {...props}
    />
  )
}

/* ───────────────── Description ───────────────── */

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm text-neutral-400",
        className
      )}
      {...props}
    />
  )
}

/* ───────────────── Action ───────────────── */

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/* ───────────────── Content ───────────────── */

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 text-neutral-300", className)}
      {...props}
    />
  )
}

/* ───────────────── Footer ───────────────── */

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pt-2 text-neutral-400", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
