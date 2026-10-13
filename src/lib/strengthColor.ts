type Stop = { t: number; c: [number, number, number] };

// coral -> amber -> blue -> cyan -> violet, mapped across score 0-100
const STOPS: Stop[] = [
  { t: 0, c: [255, 122, 114] },
  { t: 28, c: [255, 200, 87] },
  { t: 55, c: [79, 140, 255] },
  { t: 78, c: [63, 232, 210] },
  { t: 100, c: [143, 113, 247] },
];

function mix(a: [number, number, number], b: [number, number, number], f: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ] as [number, number, number];
}

function toHex([r, g, b]: [number, number, number]) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function getStrengthColor(score: number): string {
  const clamped = Math.max(0, Math.min(100, score));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (clamped >= a.t && clamped <= b.t) {
      const f = (clamped - a.t) / (b.t - a.t || 1);
      return toHex(mix(a.c, b.c, f));
    }
  }
  return toHex(STOPS[STOPS.length - 1].c);
}

export function getStrengthGradient(score: number): string {
  const from = getStrengthColor(score);
  const to = getStrengthColor(Math.min(100, score + 18));
  return `linear-gradient(90deg, ${from}, ${to})`;
}
