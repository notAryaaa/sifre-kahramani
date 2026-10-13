import { getStrengthGradient } from "@/lib/strengthColor";

export function StrengthMeter({ score, label }: { score: number; label: string }) {
  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
      aria-label={`Şifre gücü: ${label}`}
    >
      <div className="h-3.5 w-full overflow-hidden rounded-full bg-ink-raised ring-1 ring-line">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${score}%`, background: getStrengthGradient(score) }}
        />
      </div>
    </div>
  );
}
