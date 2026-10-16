// Sends game results to a Google Sheet through an Apps Script web app
// (see google-apps-script/Code.gs). The URL is inlined at build time.
const RESULTS_URL = process.env.NEXT_PUBLIC_RESULTS_URL;

export interface GameResult {
  id: string;
  firstName: string;
  lastName: string;
  correct: number;
  total: number;
  seconds: number;
}

export type SubmitStatus = "idle" | "sending" | "saved" | "failed" | "disabled";

async function post(body: Record<string, unknown>): Promise<SubmitStatus> {
  if (!RESULTS_URL) return "disabled";
  try {
    // text/plain + no-cors avoids the CORS preflight Apps Script can't answer.
    // The response is opaque, so a resolved fetch is the best signal we get.
    await fetch(RESULTS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    });
    return "saved";
  } catch {
    return "failed";
  }
}

export function submitGameResult(result: GameResult) {
  return post({ action: "game", ...result });
}

export function submitBadge(id: string, badge: string) {
  return post({ action: "badge", id, badge });
}

export function newResultId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export interface ResultRow {
  date: string;
  firstName: string;
  lastName: string;
  correct: number;
  total: number;
  seconds: number;
  badge: string;
}

export type FetchResults =
  | { ok: true; rows: ResultRow[] }
  | { ok: false; error: "not-configured" | "wrong-password" | "no-password-set" | "network" };

// The password is checked by the Apps Script, not here.
export async function fetchResults(password: string): Promise<FetchResults> {
  if (!RESULTS_URL) return { ok: false, error: "not-configured" };
  try {
    const res = await fetch(`${RESULTS_URL}?key=${encodeURIComponent(password)}`);
    return (await res.json()) as FetchResults;
  } catch {
    return { ok: false, error: "network" };
  }
}
