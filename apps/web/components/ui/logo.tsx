type LogoIconProps = {
  size?: number
}

export default function LogoIcon({ size = 36 }: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="cube"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      {/* top face – highlight (orange-500) */}
      <polygon
        points="11.19 11.35 15.75 3.51 6.75 3.51 2.25 11.35 11.19 11.35"
        fill="#f97316"
      />

      {/* bottom face – primary (orange-600) */}
      <polygon
        points="2.25 12.65 6.74 20.49 15.73 20.49 11.25 12.65 2.25 12.65"
        fill="#ea580c"
      />

      {/* side face – shadow (orange-700) */}
      <path
        d="M21.75,12l-4.5-7.87L12.74,12l4.51,7.87Z"
        fill="#c2410c"
      />
    </svg>
  )
}
