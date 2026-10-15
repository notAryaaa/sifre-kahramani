"use client";

import { useState, type FormEvent } from "react";
import { Game, type GameOutcome } from "@/components/sifre/Game";
import { PasswordLab } from "@/components/sifre/PasswordLab";
import { LearnSection } from "@/components/sifre/LearnSection";
import { GoldenRules } from "@/components/sifre/GoldenRules";
import { ShieldMascot } from "@/components/sifre/ShieldMascot";
import { Icon } from "@/components/sifre/Icon";
import { Burst } from "@/components/sifre/Burst";
import { BADGES } from "@/data/badges";
import type { PasswordAnalysis } from "@/lib/passwordAnalysis";
import { getStrengthColor } from "@/lib/strengthColor";
import { newResultId, submitBadge, submitGameResult, type SubmitStatus } from "@/lib/resultsSheet";

type Stage = "giris" | "oyun" | "sonuc" | "sifre" | "rozet";

const STEPS: { stage: Stage[]; label: string }[] = [
  { stage: ["giris"], label: "Adın" },
  { stage: ["oyun", "sonuc"], label: "Oyun" },
  { stage: ["sifre"], label: "Şifre Testi" },
  { stage: ["rozet"], label: "Rozet" },
];

interface Player {
  id: string;
  firstName: string;
  lastName: string;
}

export function Journey() {
  const [stage, setStage] = useState<Stage>("giris");
  const [player, setPlayer] = useState<Player | null>(null);
  const [outcome, setOutcome] = useState<GameOutcome | null>(null);
  const [saveStatus, setSaveStatus] = useState<SubmitStatus>("idle");
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);

  function go(next: Stage) {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStart(firstName: string, lastName: string) {
    setPlayer({ id: newResultId(), firstName, lastName });
    go("oyun");
  }

  function handleGameFinish(result: GameOutcome) {
    setOutcome(result);
    go("sonuc");
    if (!player) return;
    setSaveStatus("sending");
    submitGameResult({ ...player, ...result }).then(setSaveStatus);
  }

  function handleClaimBadge(result: PasswordAnalysis) {
    setAnalysis(result);
    go("rozet");
    if (player) submitBadge(player.id, BADGES[result.tier].title);
  }

  const activeStep = STEPS.findIndex((s) => s.stage.includes(stage));

  return (
    <>
      <ol className="mx-auto flex max-w-xl items-center justify-center gap-2 px-4 pt-5 sm:gap-3 sm:pt-8" aria-label="Adımlar">
        {STEPS.map((step, i) => (
          <li key={step.label} className="flex items-center gap-2 sm:gap-3">
            <span
              aria-current={i === activeStep ? "step" : undefined}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                i === activeStep
                  ? "border-cyan/60 bg-cyan/10 text-mist"
                  : i < activeStep
                    ? "border-line text-cyan"
                    : "border-line text-mist-faint"
              }`}
            >
              {i < activeStep ? <Icon name="check" className="h-3 w-3" /> : <span className="font-mono">{i + 1}</span>}
              <span className={i === activeStep ? "" : "hidden sm:inline"}>{step.label}</span>
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-3 bg-line sm:w-6" />}
          </li>
        ))}
      </ol>

      {stage === "giris" && <NameForm onStart={handleStart} />}
      {stage === "oyun" && <Game onFinish={handleGameFinish} />}
      {stage === "sonuc" && outcome && player && (
        <GameResult player={player} outcome={outcome} saveStatus={saveStatus} onContinue={() => go("sifre")} />
      )}
      {stage === "sifre" && <PasswordLab onClaimBadge={handleClaimBadge} />}
      {stage === "rozet" && analysis && player && outcome && (
        <>
          <BadgeCard player={player} outcome={outcome} analysis={analysis} onRetry={() => go("sifre")} />
          <LearnSection />
          <GoldenRules />
        </>
      )}
    </>
  );
}

function NameForm({ onStart }: { onStart: (firstName: string, lastName: string) => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const ready = firstName.trim().length > 0 && lastName.trim().length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (ready) onStart(firstName.trim(), lastName.trim());
  }

  return (
    <section className="relative mx-auto max-w-5xl px-4 pt-6 pb-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-raised px-3.5 py-1.5 text-xs font-medium text-mist-dim">
            <Icon name="shieldcheck" className="h-3.5 w-3.5 text-cyan" />
            Siber Güvenlik Kulübü
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.1] sm:mt-5 sm:text-5xl">
            Şifre Kahramanı olmaya <span className="text-gradient">hazır mısın?</span>
          </h1>
          <p className="mt-3 max-w-lg text-base text-mist-dim sm:mt-4 sm:text-lg">
            Önce “Hangisi Daha Güvenli?” oyununu oyna, sonra kendi şifreni test et ve rozetini kazan!
          </p>

          <form onSubmit={handleSubmit} className="glass glow-ring mt-6 max-w-lg rounded-3xl p-4 sm:mt-8 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-mist-dim">Adın</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={40}
                  autoComplete="given-name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  required
                  className="w-full rounded-2xl border border-line bg-ink-raised px-4 py-3 text-base text-mist placeholder:text-mist-faint focus:border-cyan/60"
                  placeholder="Ayşe"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-mist-dim">Soyadın</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength={40}
                  autoComplete="family-name"
                  autoCapitalize="words"
                  enterKeyHint="go"
                  required
                  className="w-full rounded-2xl border border-line bg-ink-raised px-4 py-3 text-base text-mist placeholder:text-mist-faint focus:border-cyan/60"
                  placeholder="Yılmaz"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={!ready}
              className="mt-5 w-full rounded-full bg-gradient-to-r from-cyan to-violet px-7 py-3.5 text-base font-semibold text-ink shadow-[0_18px_40px_-15px_rgba(143,113,247,0.55)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Oyuna Başla
            </button>
            <p className="mt-3 flex items-start gap-1.5 text-xs text-mist-faint">
              <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              Adın, oyun skorun ve rozetin yalnızca kulüp öğretmenlerinin göreceği bir listeye kaydedilir.
              Şifren hiçbir yere gönderilmez.
            </p>
          </form>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <div className="animate-drift h-72 w-72">
            <ShieldMascot score={88} tier="cok-guclu" className="h-full w-full" />
          </div>
          <Icon name="key" className="absolute left-6 top-10 h-8 w-8 text-amber/70" strokeWidth={1.4} />
          <Icon name="lock" className="absolute bottom-10 right-8 h-9 w-9 text-blue/70" strokeWidth={1.4} />
        </div>
      </div>
    </section>
  );
}

function gameMessage(correct: number, total: number) {
  const ratio = correct / total;
  if (ratio >= 0.9) return "Efsane! Gözün hiçbir zayıf şifreyi kaçırmıyor.";
  if (ratio >= 0.6) return "Harika gidiyorsun! Birkaç küçük incelikle tam bir uzman olacaksın.";
  return "Güzel bir başlangıç! Şimdi öğrendiklerini kendi şifrende dene.";
}

function GameResult({
  player,
  outcome,
  saveStatus,
  onContinue,
}: {
  player: Player;
  outcome: GameOutcome;
  saveStatus: SubmitStatus;
  onContinue: () => void;
}) {
  return (
    <section className="relative mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="glass glow-ring animate-fade-up rounded-3xl p-5 text-center sm:p-10">
        <p className="font-mono text-xs tracking-[0.25em] text-amber uppercase">Oyun Bitti</p>
        <h2 className="mt-2 font-display text-2xl font-semibold sm:mt-3 sm:text-4xl">Tebrikler, {player.firstName}!</h2>

        <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3 sm:mt-8">
          <div className="rounded-2xl border border-line bg-ink-raised/60 p-4 sm:p-5">
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-mist-faint">
              <Icon name="check" className="h-4 w-4" /> Doğru
            </p>
            <p className="mt-2 font-mono text-3xl font-semibold text-cyan sm:text-4xl">
              {outcome.correct}/{outcome.total}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-ink-raised/60 p-4 sm:p-5">
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-mist-faint">
              <Icon name="clock" className="h-4 w-4" /> Süre
            </p>
            <p className="mt-2 font-mono text-3xl font-semibold text-mist sm:text-4xl">
              {outcome.seconds.toFixed(1)}
              <span className="ml-1 text-lg text-mist-dim">sn</span>
            </p>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-md text-mist-dim">{gameMessage(outcome.correct, outcome.total)}</p>
        <SaveNote status={saveStatus} />

        <div className="mt-6 rounded-2xl border border-cyan/30 bg-cyan/5 p-5 sm:mt-8 sm:p-6">
          <p className="font-display text-xl font-semibold">Şimdi şifreni test edelim, ne kadar güçlü?</p>
          <p className="mt-1 text-sm text-mist-dim">Şifrenin gücüne göre bir rozet kazanacaksın.</p>
          <button
            type="button"
            onClick={onContinue}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-cyan to-violet px-7 py-3.5 text-base font-semibold text-ink transition hover:brightness-110 sm:w-auto"
          >
            Şifremi Test Et
          </button>
        </div>
      </div>
    </section>
  );
}

function ShareButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href.split("#")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title: "Şifre Kahramanı", text, url });
      } catch {
        // Closing the share sheet rejects; nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
    } catch {
      // Clipboard blocked; the button simply does nothing.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full rounded-full bg-gradient-to-r from-cyan to-violet px-6 py-3.5 text-base font-semibold text-ink transition hover:brightness-110"
    >
      {copied ? "Bağlantı kopyalandı!" : "Rozetimi Paylaş"}
    </button>
  );
}

function SaveNote({ status }: { status: SubmitStatus }) {
  if (status === "sending") return <p className="mt-3 text-xs text-mist-faint">Sonucun kaydediliyor…</p>;
  if (status === "saved") return <p className="mt-3 text-xs text-cyan">Sonucun kaydedildi.</p>;
  if (status === "failed")
    return <p className="mt-3 text-xs text-coral">Sonucun kaydedilemedi. İnternet bağlantını kontrol et.</p>;
  return null;
}

function BadgeCard({
  player,
  outcome,
  analysis,
  onRetry,
}: {
  player: Player;
  outcome: GameOutcome;
  analysis: PasswordAnalysis;
  onRetry: () => void;
}) {
  const badge = BADGES[analysis.tier];
  const color = getStrengthColor(analysis.score);
  const isTop = analysis.tier === "cok-guclu";

  return (
    <section className="relative mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="glass glow-ring animate-fade-up rounded-3xl p-5 text-center sm:p-10">
        <p className="font-mono text-xs tracking-[0.25em] text-cyan uppercase">Rozetin Hazır</p>

        <div className="relative mx-auto mt-5 h-48 w-48 sm:mt-6 sm:h-60 sm:w-60">
          <div
            className="animate-badge-in flex h-full w-full items-center justify-center rounded-full p-2"
            style={{ background: `conic-gradient(from 210deg, ${color}, var(--violet), ${color})` }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-ink">
              <ShieldMascot score={analysis.score} tier={analysis.tier} className="animate-drift h-32 w-32 sm:h-36 sm:w-36" />
            </div>
          </div>
          <Burst distance={130} className="[&>span]:h-2.5 [&>span]:w-2.5 [&>span]:[animation-delay:350ms]" />
        </div>

        <div className="animate-rise">
        <h2 className="mt-5 font-display text-3xl font-semibold sm:mt-6 sm:text-4xl" style={{ color: `color-mix(in oklab, ${color} 65%, var(--mist))` }}>
          {badge.title}
        </h2>
        <p className="mt-2 text-lg text-mist">
          {player.firstName} {player.lastName}
        </p>
        <p className="mt-1 text-sm text-mist-faint">
          Oyunda {outcome.correct}/{outcome.total} doğru, {outcome.seconds.toFixed(1)} saniye
          <br />
          Şifre gücü: {analysis.tierLabel}
        </p>
        <p className="mx-auto mt-5 max-w-md text-mist-dim">{badge.message}</p>
        </div>

        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3">
          <ShareButton text={`Şifre Kahramanı'nda ${badge.title} rozetini kazandım! Sen de dene:`} />
          {!isTop && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full rounded-full border border-line px-6 py-3.5 text-base font-semibold text-mist transition hover:border-cyan/60"
            >
              Daha güçlü bir şifreyle tekrar dene
            </button>
          )}
        </div>
        <p className="mt-6 text-sm text-mist-faint">Daha fazlasını öğrenmek için aşağı kaydır.</p>
      </div>
    </section>
  );
}
