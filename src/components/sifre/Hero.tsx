import { Icon } from "@/components/sifre/Icon";
import { ShieldMascot } from "@/components/sifre/ShieldMascot";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-raised px-3.5 py-1.5 text-xs font-medium text-mist-dim">
            <Icon name="shieldcheck" className="h-3.5 w-3.5 text-cyan" />
            Siber Güvenlik Kulübü
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            Şifren ne kadar <span className="text-gradient">güçlü?</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-mist-dim">
            Hadi birlikte öğrenelim! Şifreni test et, dijital güvenlik kahramanı ol.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#lab"
              className="rounded-full bg-gradient-to-r from-cyan to-violet px-7 py-3.5 text-base font-semibold text-ink shadow-[0_18px_40px_-15px_rgba(143,113,247,0.55)] transition hover:brightness-110"
            >
              Şifremi Test Et
            </a>
            <p className="flex items-center gap-2 text-sm text-mist-faint">
              <Icon name="lock" className="h-4 w-4 text-cyan" />
              Şifrelerin cihazından çıkmaz.
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="animate-drift h-56 w-56 sm:h-72 sm:w-72">
            <ShieldMascot score={88} tier="cok-guclu" className="h-full w-full" />
          </div>
          <Icon
            name="key"
            className="absolute left-2 top-6 h-8 w-8 text-amber/70 sm:left-6 sm:top-10"
            strokeWidth={1.4}
          />
          <Icon
            name="lock"
            className="absolute bottom-6 right-4 h-9 w-9 text-blue/70 sm:bottom-10 sm:right-8"
            strokeWidth={1.4}
          />
        </div>
      </div>
    </section>
  );
}
