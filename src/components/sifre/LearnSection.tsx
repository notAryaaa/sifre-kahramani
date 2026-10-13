import { LEARN_CARDS } from "@/data/learnCards";
import { Icon } from "@/components/sifre/Icon";

const ACCENTS = ["text-cyan", "text-violet", "text-blue", "text-amber"];

export function LearnSection() {
  return (
    <section id="ogren" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs tracking-[0.25em] text-violet uppercase">Öğren</p>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Dijital güvenliğin temel dersleri
        </h2>
        <p className="mt-3 text-mist-dim">
          Çocuklardan büyüklere kadar herkesin anlayabileceği, örneklerle anlatılan kısa dersler.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LEARN_CARDS.map((card, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <div
              key={card.id}
              className="glass flex flex-col rounded-3xl p-6 transition hover:-translate-y-1 hover:border-line"
            >
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-raised ${accent}`}>
                <Icon name={card.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-mist">{card.title}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-mist-dim">{card.body}</p>
              <p className="mt-4 rounded-xl border border-line-soft bg-ink-raised/50 p-3 font-mono text-xs leading-relaxed text-mist-faint">
                {card.example}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
