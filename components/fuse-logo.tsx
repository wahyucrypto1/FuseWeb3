"use client"

import { useTheme } from "@/components/theme-provider"

export function FuseLogo({ className = "w-12 h-12" }: { className?: string }) {
  const { theme } = useTheme()

  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="fuseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#00D4FF", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#0099FF", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx="100" cy="100" r="95" fill="url(#fuseGradient)" opacity="0.1" />

        {/* Main fuse shape */}
        <g filter="url(#glow)">
          {/* Top part */}
          <path
            d="M 100 30 L 130 70 L 100 80 L 70 70 Z"
            fill="url(#fuseGradient)"
            stroke="url(#fuseGradient)"
            strokeWidth="2"
          />

          {/* Middle part */}
          <rect
            x="85"
            y="75"
            width="30"
            height="50"
            rx="5"
            fill="url(#fuseGradient)"
            stroke="url(#fuseGradient)"
            strokeWidth="2"
          />

          {/* Bottom part */}
          <path
            d="M 100 130 L 130 170 L 100 160 L 70 170 Z"
            fill="url(#fuseGradient)"
            stroke="url(#fuseGradient)"
            strokeWidth="2"
          />

          {/* Center dot */}
          <circle cx="100" cy="100" r="8" fill="white" />
        </g>

        {/* Outer ring */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="url(#fuseGradient)" strokeWidth="2" opacity="0.5" />
      </svg>
    </div>
  )
}
