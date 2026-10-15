import type { ReactNode } from "react";

export type IconName =
  | "ruler"
  | "idcard"
  | "repeat"
  | "grid"
  | "vault"
  | "shieldcheck"
  | "puzzle"
  | "key"
  | "eye"
  | "eyeOff"
  | "check"
  | "x"
  | "sparkle"
  | "clock"
  | "lock"
  | "sun"
  | "moon"
  | "flame";

const paths: Record<IconName, ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  flame: (
    <path d="M12 21c-3.6 0-6-2.5-6-5.8 0-3.3 2.4-5 3.4-7.7.4 1.6 1.3 2.6 2.3 3 0-3.2 1.4-5.8 3.6-7.5-.3 3 1 4.9 2.4 6.7 1 1.3 1.3 2.6 1.3 3.9C19 18.5 16 21 12 21Z" />
  ),
  ruler: (
    <>
      <path d="M4 15.5 15.5 4a1.5 1.5 0 0 1 2.12 0l2.38 2.38a1.5 1.5 0 0 1 0 2.12L8.5 20 4 20Z" />
      <path d="M13.5 6 16 8.5M10.5 9 13 11.5M7.5 12 10 14.5" />
    </>
  ),
  idcard: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <circle cx="8.5" cy="11" r="1.6" />
      <path d="M5.8 15.8c.5-1.4 1.6-2.1 2.7-2.1s2.2.7 2.7 2.1M14 9.5h5M14 12.5h5M14 15.5h3.5" />
    </>
  ),
  repeat: (
    <>
      <path d="M4 7.5h11a3.5 3.5 0 0 1 3.5 3.5v1" />
      <path d="M15.5 4.5 19 7.5l-3.5 3" />
      <path d="M20 16.5H9a3.5 3.5 0 0 1-3.5-3.5v-1" />
      <path d="M8.5 19.5 5 16.5l3.5-3" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
    </>
  ),
  vault: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <path d="M12 8v1.4M12 14.6V16M8 12h1.4M14.6 12H16" />
    </>
  ),
  shieldcheck: (
    <>
      <path d="M12 3.5 19 6v6c0 4.2-3 7-7 8.5C8 19 5 16.2 5 12V6Z" />
      <path d="M9 12.2 11.3 14.5 15.3 10" />
    </>
  ),
  puzzle: (
    <>
      <path d="M9 4.5h3.2a1.3 1.3 0 0 1 1.3 1.6 1.4 1.4 0 0 0 1.95 1.63A1.3 1.3 0 0 1 17 9v3.2a1.3 1.3 0 0 1-1.6 1.3 1.4 1.4 0 0 0-1.63 1.95A1.3 1.3 0 0 1 12.5 17H9" />
      <path d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v3a1.4 1.4 0 0 0 1.95 1.63 1.4 1.4 0 0 1 0 2.74A1.4 1.4 0 0 0 4.5 15v2a1.5 1.5 0 0 0 1.5 1.5h3" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12 19 4M16 7l2.5 2.5M13.2 9.8l2 2" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3.5 3.5l17 17" />
      <path d="M10.6 5.7A10.8 10.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a14.5 14.5 0 0 1-3.2 3.9M6.6 7.4C4.2 9 2.5 12 2.5 12s2 3.7 5.4 5.4A10.6 10.6 0 0 0 12 18.5c.9 0 1.8-.1 2.6-.4" />
      <path d="M9.9 10.1a2.6 2.6 0 0 0 3.6 3.7" />
    </>
  ),
  check: <path d="M4.5 12.5 9 17l10.5-10.5" />,
  x: <path d="M5 5l14 14M19 5 5 19" />,
  sparkle: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8.2 13.4 12 12 15.8 10.6 12Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
      <path d="M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5" />
    </>
  ),
};

export function Icon({
  name,
  className,
  strokeWidth = 1.7,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
