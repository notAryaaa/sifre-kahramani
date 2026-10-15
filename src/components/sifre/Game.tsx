"use client";

import { useEffect, useRef, useState } from "react";
import { GAME_PAIRS, type GamePair } from "@/data/gamePairs";
import { Icon } from "@/components/sifre/Icon";
import { ShieldMascot } from "@/components/sifre/ShieldMascot";
import { Burst } from "@/components/sifre/Burst";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Shuffle question order and which side the safer password appears on.
function shufflePairs(pairs: GamePair[]): GamePair[] {
  return shuffle(pairs).map((pair) =>
    Math.random() < 0.5
      ? pair
      : {
          ...pair,
          passwords: [pair.passwords[1], pair.passwords[0]],
          saferIndex: pair.saferIndex === 0 ? 1 : 0,
        },
  );
}

export interface GameOutcome {
  correct: number;
  total: number;
  seconds: number;
}

function formatSeconds(ms: number) {
  return (ms / 1000).toFixed(1);
}

const CHEERS = ["Tam isabet!", "Kalkan güçleniyor!", "Harika gözün var!", "Tuzağı fark ettin!"];
const NUDGES = ["Bu bir tuzaktı!", "Hmm, yakından bak!", "Sıradakinde yakalarsın!"];

function vibrate(pattern: number | number[]) {
  // Android only; iOS Safari has no vibration API.
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
}

export function Game({ onFinish }: { onFinish: (outcome: GameOutcome) => void }) {
  // Game only mounts after the player submits their name, so shuffling here is hydration-safe.
  const [order] = useState<GamePair[]>(() => shufflePairs(GAME_PAIRS));
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<0 | 1 | null>(null);
  // One entry per answered question: true = correct.
  const [history, setHistory] = useState<boolean[]>([]);
  // The clock only runs while a question is unanswered, so reading explanations is free.
  const [elapsedMs, setElapsedMs] = useState(0);
  const [questionStart, setQuestionStart] = useState(() => performance.now());
  const [now, setNow] = useState(0);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const total = order.length;
  const current = order[step];
  const answered = selected !== null;
  const isCorrect = answered && selected === current.saferIndex;
  const score = history.filter(Boolean).length;
  const lastWrong = history.lastIndexOf(false);
  const streak = history.length - 1 - lastWrong;

  useEffect(() => {
    if (answered) return;
    const timer = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(timer);
  }, [answered]);

  // On phones the explanation and "next" button land below the fold, so bring them into view.
  useEffect(() => {
    if (answered) feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [answered]);

  const liveMs = answered ? elapsedMs : elapsedMs + Math.max(0, now - questionStart);

  function handleSelect(idx: 0 | 1) {
    if (answered) return;
    const correct = idx === current.saferIndex;
    setElapsedMs((ms) => ms + (performance.now() - questionStart));
    setSelected(idx);
    setHistory((h) => [...h, correct]);
    vibrate(correct ? 25 : [60, 50, 60]);
  }

  function handleNext() {
    if (step + 1 >= total) {
      onFinish({ correct: score, total, seconds: Math.round(elapsedMs / 100) / 10 });
    } else {
      setStep((s) => s + 1);
      setSelected(null);
      setQuestionStart(performance.now());
    }
  }

  const mascotLine = !answered
    ? "Hangisi daha güvenli?"
    : isCorrect
      ? CHEERS[step % CHEERS.length]
      : NUDGES[step % NUDGES.length];

  return (
    <section id="oyun" className="relative mx-auto max-w-5xl px-4 pt-6 pb-16 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-semibold sm:text-4xl">Hangisi daha güvenli?</h2>
        <p className="mt-1.5 text-sm text-mist-dim sm:mt-3 sm:text-base">Dikkat et, bazı şifreler göründüğü kadar güçlü değil.</p>
      </div>

      <div className="glass glow-ring mx-auto mt-5 max-w-3xl rounded-3xl p-4 sm:mt-8 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <ShieldMascot
              score={isCorrect ? 95 : 8}
              tier={isCorrect ? "cok-guclu" : "cok-zayif"}
              idle={!answered}
              className={`h-14 w-14 sm:h-16 sm:w-16 ${answered && !isCorrect ? "animate-shake" : ""}`}
            />
            {isCorrect && <Burst key={step} distance={34} />}
          </div>
          <p
            key={`${step}-${answered}`}
            aria-live="polite"
            className="animate-pop relative min-w-0 flex-1 rounded-2xl rounded-bl-sm border border-line bg-ink-raised px-3.5 py-2.5 font-display text-base font-semibold sm:text-lg"
          >
            {mascotLine}
          </p>
          <p className="flex flex-shrink-0 items-center gap-1 font-mono text-sm tabular-nums text-mist-dim">
            <Icon name="clock" className="h-4 w-4" />
            {formatSeconds(liveMs)}
            <span className="text-xs">sn</span>
          </p>
        </div>

        <div className="mt-4 flex gap-1" aria-hidden="true">
          {order.map((pair, i) => (
            <span
              key={pair.id}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                history[i] === true
                  ? "bg-cyan"
                  : history[i] === false
                    ? "bg-coral"
                    : i === step
                      ? "bg-mist-faint"
                      : "bg-line"
              }`}
            />
          ))}
        </div>
        <div className="mt-2 flex h-7 items-center justify-between text-sm text-mist-dim">
          <span>
            Soru {step + 1}/{total} · {score} doğru
          </span>
          {streak >= 2 && (
            <span
              key={streak}
              className="animate-pop flex items-center gap-1 rounded-full bg-amber/15 px-2.5 py-1 text-xs font-semibold text-amber"
            >
              <Icon name="flame" className="h-3.5 w-3.5" />
              {streak} üst üste
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
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
                key={`${step}-${idx}`}
                type="button"
                onClick={() => handleSelect(idx as 0 | 1)}
                disabled={answered}
                className={`relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-ink-raised/60 p-4 text-center transition active:scale-[0.97] sm:gap-3 sm:p-6 ${stateClasses}`}
              >
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
                {chosen && isSafer && <Burst distance={70} />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div ref={feedbackRef} className="animate-fade-up mt-4 scroll-mb-4 rounded-2xl border border-line bg-ink-raised/60 p-4 sm:mt-6 sm:p-5">
            <p className="text-sm leading-relaxed text-mist-dim">{current.reason}</p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-4 w-full rounded-full bg-mist px-5 py-3.5 text-base font-semibold text-ink transition hover:bg-cyan sm:mt-5 sm:w-auto sm:py-2.5 sm:text-sm"
            >
              {step + 1 >= total ? "Sonucu gör" : "Sonraki soru"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
