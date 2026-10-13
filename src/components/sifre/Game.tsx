"use client";

import { useEffect, useState } from "react";
import { GAME_PAIRS, type GamePair } from "@/data/gamePairs";
import { Icon } from "@/components/sifre/Icon";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function completionMessage(score: number, total: number) {
  const ratio = score / total;
  if (ratio >= 0.9) return "Efsane bir Şifre Kahramanısın! Gözün hiçbir zayıf şifreyi kaçırmıyor.";
  if (ratio >= 0.6) return "Harika gidiyorsun! Birkaç küçük incelikle tam bir uzman olacaksın.";
  return "Güzel bir başlangıç! “Öğren” bölümüne göz atıp tekrar denemeye ne dersin?";
}

export function Game() {
  const [order, setOrder] = useState<GamePair[]>(GAME_PAIRS);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<0 | 1 | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setOrder(shuffle(GAME_PAIRS));
  }, []);

  const total = order.length;
  const current = order[step];
  const answered = selected !== null;
  const isCorrect = answered && selected === current.saferIndex;

  function handleSelect(idx: 0 | 1) {
    if (answered) return;
    setSelected(idx);
    if (idx === current.saferIndex) setScore((s) => s + 1);
  }

  function handleNext() {
    if (step + 1 >= total) {
      setFinished(true);
    } else {
      setStep((s) => s + 1);
      setSelected(null);
    }
  }

  function handleRestart() {
    setOrder(shuffle(GAME_PAIRS));
    setStep(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  return (
    <section id="oyun" className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs tracking-[0.25em] text-amber uppercase">Oyun</p>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Hangisi Daha Güvenli?</h2>
        <p className="mt-3 text-mist-dim">
          İki şifreden hangisinin daha güvenli olduğunu tahmin et. Unutma: sembol ya da büyük harf içermek
          tek başına bir şifreyi güvenli yapmaz!
        </p>
      </div>

      <div className="glass glow-ring mx-auto mt-10 max-w-3xl rounded-3xl p-6 sm:p-10">
        {!finished ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {order.map((pair, i) => (
                  <Icon
                    key={pair.id}
                    name="shieldcheck"
                    className={`h-4 w-4 ${
                      i < step
                        ? "text-cyan"
                        : i === step
                          ? "text-mist"
                          : "text-mist-faint opacity-40"
                    }`}
                  />
                ))}
              </div>
              <p className="font-mono text-sm text-mist-dim">
                Soru {step + 1}/{total} &middot; Skor {score}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {current.passwords.map((pw, idx) => {
                const isSafer = idx === current.saferIndex;
                const chosen = selected === idx;
                let stateClasses = "border-line hover:border-cyan/50";
                if (answered) {
                  if (isSafer) stateClasses = "border-cyan bg-cyan/10";
                  else if (chosen) stateClasses = "border-coral bg-coral/10 animate-shake";
                  else stateClasses = "border-line opacity-60";
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx as 0 | 1)}
                    disabled={answered}
                    className={`flex flex-col items-center gap-3 rounded-2xl border-2 bg-ink-raised/50 p-6 text-center transition ${stateClasses}`}
                  >
                    <span className="font-mono text-xs uppercase tracking-wide text-mist-faint">
                      Seçenek {idx === 0 ? "A" : "B"}
                    </span>
                    <span className="break-all font-mono text-lg font-medium text-mist">{pw}</span>
                    {answered && isSafer && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-cyan">
                        <Icon name="check" className="h-3.5 w-3.5" /> Daha güvenli
                      </span>
                    )}
                    {answered && chosen && !isSafer && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-coral">
                        <Icon name="x" className="h-3.5 w-3.5" /> Daha az güvenli
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="animate-fade-up mt-6 rounded-2xl border border-line bg-ink-raised/60 p-5">
                <p className={`mb-1.5 flex items-center gap-2 text-sm font-semibold ${isCorrect ? "text-cyan" : "text-amber"}`}>
                  <Icon name={isCorrect ? "check" : "sparkle"} className="h-4 w-4" />
                  {isCorrect ? "Doğru bildin!" : "Tam değil, ama öğrenmenin en iyi yolu bu!"}
                </p>
                <p className="text-sm leading-relaxed text-mist-dim">{current.reason}</p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-5 rounded-full bg-mist px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-cyan"
                >
                  {step + 1 >= total ? "Sonucu Gör" : "Sonraki Soru"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="animate-fade-up py-6 text-center">
            <Icon name="shieldcheck" className="mx-auto h-14 w-14 text-cyan" strokeWidth={1.4} />
            <p className="mt-4 font-display text-2xl font-semibold">
              {score}/{total} doğru
            </p>
            <p className="mx-auto mt-3 max-w-md text-mist-dim">{completionMessage(score, total)}</p>
            <button
              type="button"
              onClick={handleRestart}
              className="mt-6 rounded-full bg-gradient-to-r from-cyan to-violet px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
            >
              Tekrar Oyna
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
