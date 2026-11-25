"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type RankedScore = {
  nickname: string;
  score: number;
  achievedAt?: string | null;
  playTimeMs?: number | null;
};
const standingsKey = "diguldigul:server-top5:v1";
const kstDate = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formatDate(value: RankedScore["achievedAt"]) {
  if (typeof value !== "string") return "—";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? kstDate.format(timestamp) : "—";
}

function formatPlayTime(value: RankedScore["playTimeMs"]) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) return "—";
  const seconds = Math.floor(value / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = String(Math.floor(seconds / 60) % 60).padStart(2, "0");
  const clock = `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
  return hours ? `${hours}:${clock}` : clock;
}

function validRows(rows: unknown): rows is RankedScore[] {
  return Array.isArray(rows) && rows.length <= 5 && rows.every(row =>
    typeof row?.nickname === "string" && /^[가-힣A-Za-z0-9]{2,10}$/.test(row.nickname) &&
    Number.isSafeInteger(row.score) && row.score > 0
  );
}

function readStandingsCache() {
  try { return localStorage.getItem(standingsKey); } catch { return null; }
}

function subscribeToStandingsCache(update: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === standingsKey || event.key === null) update();
  }
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function parseStandingsCache(raw: string | null): RankedScore[] | null {
  if (!raw) return null;
  try {
    const rows: unknown = JSON.parse(raw);
    return validRows(rows) ? rows : null;
  } catch {
    return null;
  }
}

export default function DigulTopFive({ lang }: { lang: "ko" | "en" }) {
  const english = lang === "en";
  const [serverRows, setServerRows] = useState<RankedScore[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const cached = useSyncExternalStore(subscribeToStandingsCache, readStandingsCache, () => null);
  const rows = serverRows ?? parseStandingsCache(cached);

  useEffect(() => {
    let mounted = true;
    let pending: AbortController | null = null;

    async function refresh() {
      if (document.hidden || pending) return;
      const controller = new AbortController();
      pending = controller;
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch("/api/games/digul/leaderboard", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Leaderboard unavailable");
        const data = await response.json();
        const scores = data?.rows;
        if (!validRows(scores)) throw new Error("Invalid leaderboard");
        if (mounted) {
          try { localStorage.setItem(standingsKey, JSON.stringify(scores)); } catch { /* In-memory scores still apply. */ }
          setServerRows(scores);
          setUnavailable(false);
        }
      } catch {
        if (mounted) setUnavailable(true);
      } finally {
        window.clearTimeout(timeout);
        pending = null;
      }
    }

    void refresh();
    const interval = window.setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("online", refresh);
    return () => {
      mounted = false;
      pending?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("online", refresh);
    };
  }, []);

  let status = "";
  if (rows?.length && (unavailable || serverRows === null)) {
    status = english ? "Showing the last available scores." : "마지막으로 확인한 순위예요.";
  } else if (unavailable) {
    status = english ? "Scores are temporarily unavailable." : "지금은 순위를 불러올 수 없어요.";
  } else if (serverRows === null) {
    status = english ? "Loading scores…" : "순위를 불러오는 중이에요.";
  } else if (serverRows.length === 0) {
    status = english ? "No scores recorded yet." : "아직 등록된 점수가 없어요.";
  }

  return (
    <section aria-labelledby="digul-ranking-title">
      <header className="text-center">
        <h1 id="digul-ranking-title" className="font-serif text-[clamp(2rem,4vw,3rem)] leading-tight font-bold tracking-[-0.02em]">
          {english ? "Digul Digul leaderboard" : "디굴디굴 순위표"}
        </h1>
        <p className="mt-3 text-sm text-black/65">
          {english ? "The five highest personal bests of all time." : "역대 최고 점수를 기록한 다섯 명을 소개해요."}
        </p>
      </header>
      <table aria-labelledby="digul-ranking-title" className="mt-7 w-full border-y border-caramel/30 text-left text-xs sm:mt-9 sm:text-sm">
        <thead className="border-b border-caramel/20 text-caramel">
          <tr className="[&>th]:px-1 [&>th]:py-3 [&>th]:font-semibold sm:[&>th]:px-4">
            <th scope="col">{english ? "Date" : "날짜"}</th>
            <th scope="col">{english ? "Nickname" : "닉네임"}</th>
            <th scope="col" className="text-right">{english ? "Play time" : "게임 시간"}</th>
            <th scope="col" className="text-right">{english ? "Score" : "점수"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-caramel/10 tabular-nums">
          {rows?.map(({ nickname, score, achievedAt, playTimeMs }, index) => (
            <tr key={nickname} className="[&>td]:px-1 [&>td]:py-3 sm:[&>td]:px-4">
              <td className="whitespace-nowrap">{formatDate(achievedAt)}</td>
              <td>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="shrink-0 text-[0.7rem] font-semibold text-caramel">{english ? `#${index + 1}` : `${index + 1}위`}</span>
                  <span className="min-w-0 break-all">{nickname}</span>
                </div>
              </td>
              <td className="text-right">{formatPlayTime(playTimeMs)}</td>
              <td className="text-right font-bold text-caramel">{score.toLocaleString(english ? "en-US" : "ko-KR")}</td>
            </tr>
          ))}
          {!rows?.length && (
            <tr>
              <td colSpan={4} className="py-7 text-center text-sm text-black/65"><span role="status">{status}</span></td>
            </tr>
          )}
        </tbody>
      </table>
      {Boolean(rows?.length) && status && <p role="status" className="mt-2 text-sm text-black/65">{status}</p>}
    </section>
  );
}
