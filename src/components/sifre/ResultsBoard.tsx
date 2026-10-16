"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Icon } from "@/components/sifre/Icon";
import { BADGES } from "@/data/badges";
import type { StrengthTier } from "@/lib/passwordAnalysis";
import { getStrengthColor } from "@/lib/strengthColor";
import { fetchResults, type FetchResults, type ResultRow } from "@/lib/resultsSheet";

// Badge titles in order, weakest first, with a representative strength score for color.
const BADGE_ORDER: { tier: StrengthTier; score: number }[] = [
  { tier: "cok-zayif", score: 10 },
  { tier: "zayif", score: 30 },
  { tier: "orta", score: 52 },
  { tier: "iyi", score: 75 },
  { tier: "cok-guclu", score: 95 },
];

function badgeColor(title: string) {
  const entry = BADGE_ORDER.find((b) => BADGES[b.tier].title === title);
  return entry ? getStrengthColor(entry.score) : null;
}

const ERRORS: Record<Exclude<FetchResults, { ok: true }>["error"], string> = {
  "wrong-password": "Şifre yanlış. Tekrar dene.",
  "no-password-set": "Öğretmen şifresi henüz ayarlanmamış. Kurulum adımlarına bak (TEACHER_PASSWORD).",
  "not-configured": "Sonuç tablosu henüz bağlanmamış (RESULTS_URL ayarlanmalı).",
  network: "Sonuçlara ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.",
};

function personKey(r: ResultRow) {
  return `${r.firstName} ${r.lastName}`.trim().toLocaleLowerCase("tr");
}

// More correct answers first, then faster.
function compare(a: ResultRow, b: ResultRow) {
  return b.correct - a.correct || a.seconds - b.seconds;
}

function isToday(iso: string) {
  const d = new Date(iso);
  return !Number.isNaN(d.getTime()) && d.toDateString() === new Date().toDateString();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function ResultsBoard() {
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(pw: string) {
    setLoading(true);
    setError(null);
    const result = await fetchResults(pw);
    setLoading(false);
    if (result.ok) {
      setPassword(pw);
      setRows(result.rows);
    } else {
      setError(ERRORS[result.error]);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password) load(password);
  }

  return (
    <section className="mx-auto max-w-4xl px-4 pt-6 pb-16 sm:px-6 sm:py-12">
      <h1 className="font-display text-2xl font-semibold sm:text-4xl">Sonuçlar</h1>
      <p className="mt-1.5 text-sm text-mist-dim sm:text-base">
        Oyunu bitiren herkesin skoru, süresi ve rozeti. Bu sayfa sadece öğretmenler içindir.
      </p>

      {rows === null ? (
        <form onSubmit={handleSubmit} className="glass glow-ring mt-6 max-w-md rounded-3xl p-5 sm:p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-mist-dim">Öğretmen şifresi</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              enterKeyHint="go"
              className="w-full rounded-2xl border border-line bg-ink-raised px-4 py-3 text-base text-mist focus:border-cyan/60"
            />
          </label>
          <button
            type="submit"
            disabled={!password || loading}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-cyan to-violet px-6 py-3.5 text-base font-semibold text-ink transition hover:brightness-110 disabled:opacity-40"
          >
            {loading ? "Yükleniyor…" : "Sonuçları göster"}
          </button>
          {error && (
            <p role="alert" className="mt-3 text-sm text-coral">
              {error}
            </p>
          )}
        </form>
      ) : (
        <Board rows={rows} loading={loading} error={error} onRefresh={() => load(password)} />
      )}
    </section>
  );
}

function Board({
  rows,
  loading,
  error,
  onRefresh,
}: {
  rows: ResultRow[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  const [bestOnly, setBestOnly] = useState(true);
  const [todayOnly, setTodayOnly] = useState(false);
  const [query, setQuery] = useState("");

  const view = useMemo(() => {
    const inRange = todayOnly ? rows.filter((r) => isToday(r.date)) : rows;
    const attempts = new Map<string, number>();
    for (const r of inRange) attempts.set(personKey(r), (attempts.get(personKey(r)) ?? 0) + 1);

    let list = [...inRange].sort(compare);
    if (bestOnly) {
      const seen = new Set<string>();
      list = list.filter((r) => {
        const key = personKey(r);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    const ranked = list.map((r, i) => ({ row: r, rank: i + 1, attempts: attempts.get(personKey(r)) ?? 1 }));
    const q = query.trim().toLocaleLowerCase("tr");
    return {
      inRange,
      ranked: q ? ranked.filter(({ row }) => personKey(row).includes(q)) : ranked,
      people: attempts.size,
    };
  }, [rows, bestOnly, todayOnly, query]);

  const { inRange, ranked, people } = view;
  const avgCorrect = inRange.length ? inRange.reduce((s, r) => s + r.correct, 0) / inRange.length : 0;
  const avgTotal = inRange.length ? inRange.reduce((s, r) => s + r.total, 0) / inRange.length : 0;
  const avgSeconds = inRange.length ? inRange.reduce((s, r) => s + r.seconds, 0) / inRange.length : 0;
  const withBadge = inRange.filter((r) => r.badge).length;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          label="Zaman"
          value={todayOnly ? "today" : "all"}
          onChange={(v) => setTodayOnly(v === "today")}
          options={[
            { value: "all", label: "Tüm zamanlar" },
            { value: "today", label: "Bugün" },
          ]}
        />
        <Segmented
          label="Denemeler"
          value={bestOnly ? "best" : "all"}
          onChange={(v) => setBestOnly(v === "best")}
          options={[
            { value: "best", label: "Kişi başı en iyi" },
            { value: "all", label: "Tüm denemeler" },
          ]}
        />
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm text-mist-dim transition hover:text-mist disabled:opacity-50"
        >
          <Icon name="repeat" className="h-4 w-4" />
          {loading ? "Yenileniyor…" : "Yenile"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-coral">
          {error}
        </p>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Oyuncu" value={String(people)} detail={`${inRange.length} oyun`} />
        <Stat label="Ortalama doğru" value={`${avgCorrect.toFixed(1)}/${Math.round(avgTotal) || 10}`} />
        <Stat label="Ortalama süre" value={`${avgSeconds.toFixed(1)} sn`} />
        <Stat
          label="Rozete ulaşan"
          value={inRange.length ? `%${Math.round((withBadge / inRange.length) * 100)}` : "—"}
          detail="şifre testini bitiren"
        />
      </dl>

      {inRange.length > 0 && <BadgeSpread rows={inRange} />}

      <div className="mt-6 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">Sıralama</h2>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İsim ara"
          className="w-40 rounded-full border border-line bg-ink-raised px-4 py-2 text-base text-mist placeholder:text-mist-faint focus:border-cyan/60 sm:w-56 sm:text-sm"
        />
      </div>

      {ranked.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line px-4 py-10 text-center text-sm text-mist-dim">
          {inRange.length === 0
            ? todayOnly
              ? "Bugün henüz kimse oyunu bitirmedi."
              : "Henüz kimse oyunu bitirmedi. Bağlantıyı öğrencilerle paylaş!"
            : "Bu isimle eşleşen oyuncu yok."}
        </p>
      ) : (
        <ol className="mt-3 space-y-2">
          {ranked.map(({ row, rank, attempts }) => (
            <ResultItem key={`${row.date}-${personKey(row)}`} row={row} rank={rank} attempts={bestOnly ? attempts : 1} />
          ))}
        </ol>
      )}
    </div>
  );
}

function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex rounded-full border border-line bg-ink-raised/60 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`rounded-full px-3 py-1.5 text-sm transition ${
            value === o.value ? "bg-mist font-medium text-ink" : "text-mist-dim hover:text-mist"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-ink-raised/60 p-4">
      <dt className="text-xs text-mist-faint">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</dd>
      {detail && <dd className="text-xs text-mist-faint">{detail}</dd>}
    </div>
  );
}

function BadgeSpread({ rows }: { rows: ResultRow[] }) {
  const counts = BADGE_ORDER.map(({ tier, score }) => ({
    title: BADGES[tier].title,
    color: getStrengthColor(score),
    count: rows.filter((r) => r.badge === BADGES[tier].title).length,
  })).reverse();
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="mt-5 rounded-2xl border border-line bg-ink-raised/60 p-4">
      <h2 className="text-sm font-medium text-mist-dim">Kazanılan rozetler</h2>
      <ul className="mt-3 space-y-2">
        {counts.map((c) => (
          <li key={c.title} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-3 text-sm">
            <span className="truncate text-mist">{c.title}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-line">
              <span
                className="block h-full rounded-full transition-[width] duration-500"
                style={{ width: `${(c.count / max) * 100}%`, background: c.color }}
              />
            </span>
            <span className="text-right tabular-nums text-mist-dim">{c.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PODIUM = ["text-amber", "text-mist", "text-mist"];

function ResultItem({ row, rank, attempts }: { row: ResultRow; rank: number; attempts: number }) {
  const color = row.badge ? badgeColor(row.badge) : null;
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-line bg-ink-raised/60 p-3 sm:p-4">
      <span
        className={`w-8 flex-shrink-0 text-center font-display text-lg font-semibold tabular-nums ${
          rank <= 3 ? PODIUM[rank - 1] : "text-mist-faint"
        }`}
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-mist">
          {row.firstName} {row.lastName}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-mist-faint">
          <span>{formatDate(row.date)}</span>
          {attempts > 1 && <span>{attempts} deneme</span>}
          {row.badge ? (
            <span
              className="rounded-full border px-2 py-0.5 font-medium"
              style={{
                borderColor: color ?? undefined,
                color: color ? `color-mix(in oklab, ${color} 65%, var(--mist))` : undefined,
              }}
            >
              {row.badge}
            </span>
          ) : (
            <span>rozet yok</span>
          )}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="font-display text-lg font-semibold tabular-nums text-mist">
          {row.correct}/{row.total}
        </p>
        <p className="text-xs tabular-nums text-mist-faint">{row.seconds.toFixed(1)} sn</p>
      </div>
    </li>
  );
}
