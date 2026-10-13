"use client";

import { useId } from "react";
import type { StrengthTier } from "@/lib/passwordAnalysis";
import { getStrengthColor } from "@/lib/strengthColor";
import { Icon } from "@/components/sifre/Icon";

interface ShieldMascotProps {
  score: number;
  tier: StrengthTier;
  idle?: boolean;
  className?: string;
}

function Face({ tier, idle }: { tier: StrengthTier; idle: boolean }) {
  if (idle) {
    return (
      <>
        <circle cx="9.3" cy="11.6" r="1" fill="#0a0f24" />
        <circle cx="14.7" cy="11.6" r="1" fill="#0a0f24" />
        <path d="M9.4 15.2c.9.6 3.3.6 4.2 0" stroke="#0a0f24" />
      </>
    );
  }

  switch (tier) {
    case "cok-zayif":
      return (
        <>
          <path d="M8.1 10.4l2.1 1M15.9 10.4l-2.1 1" stroke="#0a0f24" />
          <circle cx="9.3" cy="12.1" r="1" fill="#0a0f24" />
          <circle cx="14.7" cy="12.1" r="1" fill="#0a0f24" />
          <path d="M9.3 16.3c.9-1 3.3-1 4.2 0" stroke="#0a0f24" />
          <path d="M16.6 13.6c.3.6.2 1.1-.4 1.3" stroke="#0a0f24" strokeWidth={1.3} />
        </>
      );
    case "zayif":
      return (
        <>
          <path d="M8.3 10.7l1.7.7M15.7 10.7l-1.7.7" stroke="#0a0f24" />
          <circle cx="9.3" cy="12" r="1" fill="#0a0f24" />
          <circle cx="14.7" cy="12" r="1" fill="#0a0f24" />
          <path d="M9.5 16c.7-.5 3.3-.5 4 0" stroke="#0a0f24" />
        </>
      );
    case "orta":
      return (
        <>
          <circle cx="9.3" cy="11.8" r="1" fill="#0a0f24" />
          <circle cx="14.7" cy="11.8" r="1" fill="#0a0f24" />
          <path d="M9.4 15.6h4.2" stroke="#0a0f24" />
        </>
      );
    case "iyi":
      return (
        <>
          <circle cx="9.3" cy="11.6" r="1" fill="#0a0f24" />
          <circle cx="14.7" cy="11.6" r="1" fill="#0a0f24" />
          <path d="M9.2 15c1 1.2 3.6 1.2 4.6 0" stroke="#0a0f24" />
        </>
      );
    case "cok-guclu":
    default:
      return (
        <>
          <path d="M8.5 11.6 9.3 10.6 10.1 11.6 9.3 12.6Z" fill="#0a0f24" stroke="none" />
          <path d="M13.9 11.6 14.7 10.6 15.5 11.6 14.7 12.6Z" fill="#0a0f24" stroke="none" />
          <path d="M9 14.8c1.1 1.5 3.9 1.5 5 0" stroke="#0a0f24" strokeWidth={1.4} />
        </>
      );
  }
}

export function ShieldMascot({ score, tier, idle = false, className }: ShieldMascotProps) {
  const gradId = useId();
  const glowId = useId();
  const color = getStrengthColor(idle ? 45 : score);
  const colorLight = getStrengthColor(idle ? 65 : Math.min(100, score + 22));
  const crackOpacity = idle
    ? 0
    : tier === "cok-zayif"
      ? 1
      : tier === "zayif"
        ? 0.55
        : tier === "orta"
          ? 0.2
          : 0;

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        className="absolute inset-0 -z-10 rounded-full blur-2xl transition-colors duration-500"
        style={{ background: color, opacity: idle ? 0.18 : 0.3 + score / 250 }}
      />
      {!idle && tier === "cok-guclu" && (
        <>
          <Icon
            name="sparkle"
            className="animate-spark absolute -top-2 right-6 h-5 w-5 text-cyan"
            strokeWidth={1.4}
          />
          <Icon
            name="sparkle"
            className="animate-spark absolute top-10 -left-3 h-4 w-4 text-violet"
            strokeWidth={1.4}
          />
        </>
      )}
      <svg
        viewBox="0 0 24 27"
        className={`relative h-full w-full ${idle || tier !== "cok-guclu" ? "" : "animate-pulse-glow"}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={colorLight} />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
        </defs>
        <path
          d="M12 1.2 21.5 4.6v7.7c0 6.6-4.4 11.3-9.5 13.1C7 23.6 2.5 18.9 2.5 12.3V4.6Z"
          fill={`url(#${gradId})`}
          stroke="rgba(10,15,36,0.35)"
          strokeWidth="0.6"
          style={{ transition: "fill 0.5s ease" }}
        />
        <path
          d="M12 1.2 21.5 4.6v7.7c0 6.6-4.4 11.3-9.5 13.1C7 23.6 2.5 18.9 2.5 12.3V4.6Z"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.5"
        />
        <g
          stroke="rgba(10,15,36,0.55)"
          strokeWidth="0.45"
          fill="none"
          style={{ opacity: crackOpacity, transition: "opacity 0.5s ease" }}
        >
          <path d="M9 6.5 11 11l-2 2.4 2.6 3.2" />
          <path d="M16 6.8 14.3 10.5l1.9 2.6-1.4 4.6" />
          <path d="M12 2.5 12.6 8" />
        </g>
        <g>
          <Face tier={tier} idle={idle} />
        </g>
      </svg>
    </div>
  );
}
