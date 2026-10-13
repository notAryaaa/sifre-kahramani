"use client";

import { useMemo, useState } from "react";
import { analyzePassword } from "@/lib/passwordAnalysis";
import { ShieldMascot } from "@/components/sifre/ShieldMascot";
import { StrengthMeter } from "@/components/sifre/StrengthMeter";
import { Icon } from "@/components/sifre/Icon";

const CHAR_TYPES: { key: "hasUpper" | "hasLower" | "hasDigit" | "hasSymbol"; label: string }[] = [
  { key: "hasUpper", label: "Büyük harf" },
  { key: "hasLower", label: "Küçük harf" },
  { key: "hasDigit", label: "Rakam" },
  { key: "hasSymbol", label: "Sembol" },
];

export function PasswordLab() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const analysis = useMemo(() => analyzePassword(password), [password]);
  const idle = password.length === 0;

  return (
    <section id="lab" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs tracking-[0.25em] text-cyan uppercase">Şifre Laboratuvarı</p>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Şifreni yaz, Siber Kalkan anında tepki versin
        </h2>
        <p className="mt-3 text-mist-dim">
          Aşağıya örnek bir şifre yaz. Gerçek şifrelerini buraya girme — burası sadece deneme ve öğrenme alanı.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass glow-ring rounded-3xl p-6 sm:p-8">
          <label htmlFor="pw-input" className="mb-2 block text-sm font-medium text-mist-dim">
            Örnek şifre
          </label>
          <div className="relative">
            <input
              id="pw-input"
              type={visible ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Buraya örnek bir şifre yaz..."
              className="w-full rounded-2xl border border-line bg-ink-raised px-5 py-4 pr-24 font-mono text-lg text-mist placeholder:text-mist-faint focus:border-cyan/60"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}
                className="rounded-xl p-2.5 text-mist-dim transition hover:bg-ink-card hover:text-mist"
              >
                <Icon name={visible ? "eyeOff" : "eye"} className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setPassword("")}
                disabled={idle}
                aria-label="Şifreyi temizle"
                className="rounded-xl p-2.5 text-mist-dim transition hover:bg-ink-card hover:text-mist disabled:opacity-30"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-mist-faint">
            <Icon name="lock" className="h-3.5 w-3.5" />
            Bu analiz tamamen cihazında çalışır; hiçbir şifre internete gönderilmez.
          </p>

          {idle ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-12 text-center">
              <Icon name="sparkle" className="h-8 w-8 text-mist-faint" />
              <p className="max-w-sm text-sm text-mist-dim">
                Bir şey yazmaya başladığında şifre gücü, karakter analizi ve kırılma süresi burada belirecek.
              </p>
            </div>
          ) : (
            <div className="mt-8 animate-fade-up space-y-8">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-mist-dim">Karakter analizi</h3>
                <div className="flex flex-wrap gap-2">
                  {CHAR_TYPES.map(({ key, label }) => {
                    const present = analysis[key];
                    return (
                      <span
                        key={key}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
                          present
                            ? "border-cyan/40 bg-cyan/10 text-mist"
                            : "border-line text-mist-faint"
                        }`}
                      >
                        <Icon name={present ? "check" : "x"} className="h-3.5 w-3.5" />
                        {label}
                      </span>
                    );
                  })}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-mist-dim">
                    {analysis.length} karakter
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-ink-raised/60 p-4">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-mist-faint">
                    <Icon name="clock" className="h-4 w-4" />
                    Tahmini kırılma süresi
                  </p>
                  <p className="mt-1 font-mono text-2xl font-semibold text-mist">{analysis.crackTimeText}</p>
                  <p className="mt-1 text-xs text-mist-faint">
                    Varsayım: saniyede 10 milyar deneme yapabilen bir saldırgan.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-ink-raised/60 p-4">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-mist-faint">
                    <Icon name="sparkle" className="h-4 w-4" />
                    Tespit edilen risk
                  </p>
                  <p className="mt-1 font-mono text-2xl font-semibold text-mist">{analysis.weaknesses.length}</p>
                  <p className="mt-1 text-xs text-mist-faint">
                    {analysis.weaknesses.length === 0
                      ? "Belirgin bir zayıflık kalıbı bulunamadı."
                      : "Aşağıdaki önerilere göz at."}
                  </p>
                </div>
              </div>

              {analysis.suggestions.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-mist-dim">Nasıl güçlendirebilirsin?</h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((s) => (
                      <li key={s} className="flex items-start gap-2.5 text-sm text-mist">
                        <Icon name="check" className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl border border-line bg-ink-raised/40 p-4">
                <h3 className="mb-1.5 text-sm font-semibold text-mist-dim">Neden?</h3>
                <p className="text-sm leading-relaxed text-mist-dim">{analysis.explanation}</p>
              </div>
            </div>
          )}
        </div>

        <div className="glass glow-ring flex flex-col items-center gap-5 rounded-3xl p-6 text-center lg:sticky lg:top-24 lg:self-start">
          <ShieldMascot score={analysis.score} tier={analysis.tier} idle={idle} className="h-36 w-36" />
          <div className="w-full">
            <p className="font-display text-xl font-semibold">
              {idle ? "Hazır bekliyorum!" : analysis.tierLabel}
            </p>
            <p className="mt-1 text-sm text-mist-faint">
              {idle ? "Siber Kalkan" : `Güç puanı: ${analysis.score}/100`}
            </p>
          </div>
          <StrengthMeter score={idle ? 0 : analysis.score} label={idle ? "Boş" : analysis.tierLabel} />
        </div>
      </div>
    </section>
  );
}
