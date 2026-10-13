import { GOLDEN_RULES } from "@/data/goldenRules";
import { Icon } from "@/components/sifre/Icon";
import { ShieldMascot } from "@/components/sifre/ShieldMascot";

export function GoldenRules() {
  return (
    <section id="kurallar" className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="glass glow-ring overflow-hidden rounded-3xl p-6 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs tracking-[0.25em] text-cyan uppercase">Son Hatırlatma</p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">5 Altın Şifre Kuralı</h2>
        </div>

        <ol className="mx-auto mt-10 max-w-xl space-y-4">
          {GOLDEN_RULES.map((rule, i) => (
            <li
              key={rule.text}
              className="flex items-center gap-4 rounded-2xl border border-line bg-ink-raised/50 p-4"
            >
              <span className="font-display text-2xl font-semibold text-mist-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-ink-card text-cyan">
                <Icon name={rule.icon} className="h-4 w-4" />
              </span>
              <span className="text-base text-mist">{rule.text}</span>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <ShieldMascot score={92} tier="cok-guclu" className="h-20 w-20" />
          <p className="max-w-md font-display text-xl font-semibold text-mist">
            Dijital dünyada en güçlü kahraman, bilinçli kullanıcıdır!
          </p>
        </div>
      </div>
    </section>
  );
}
