import { leaderboard as sqliteLeaderboard } from "./digul-leaderboard.mjs";

/** @param {{nickname: string, score: number, playTimeMs?: number | null} | null} result */
export async function loadLeaderboard(result = null) {
  const token = process.env.DIGUL_SCORE_TOKEN;
  let key;
  if (token !== undefined) {
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key || !/^[0-9a-f]{64}$/i.test(token)) throw new Error("Leaderboard token configuration is invalid.");
  } else {
    // Other features can use Supabase locally without sending local game scores there.
    const hosted = process.env.VERCEL || process.env.NODE_ENV === "production";
    key = process.env.DIGUL_SUPABASE_SECRET_KEY ||
      (hosted && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
    if (process.env.DIGUL_LEADERBOARD_DB_PATH || !key) return sqliteLeaderboard(result);
  }

  const projectUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!projectUrl) throw new Error("Leaderboard database is not configured.");
  const submit = result !== null && result.score > 0;
  const endpoint = new URL("/rest/v1/rpc/" + (submit ? "digul_leaderboard_submit" : "digul_leaderboard_top5"), projectUrl);
  if (endpoint.protocol !== "https:") throw new Error("Leaderboard database requires HTTPS.");

  const headers = { apikey: key, "Content-Type": "application/json" };
  // PostgREST accepts legacy JWTs as bearer credentials. Opaque keys belong in apikey.
  if (!key.startsWith("sb_")) headers.Authorization = "Bearer " + key;
  if (token) headers["x-digul-server-token"] = token;
  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(submit ? {
      p_nickname: result.nickname,
      p_score: result.score,
      p_play_time_ms: result.playTimeMs ?? null,
    } : {}),
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Leaderboard database request failed.");
  const entries = await response.json();
  if (!Array.isArray(entries) || entries.length > 5) throw new Error("Invalid leaderboard response.");
  const rows = entries.map(({ nickname, score, achievedAt, playTimeMs }) => {
    if (typeof nickname !== "string" || !/^[가-힣a-zA-Z0-9]{2,10}$/u.test(nickname) ||
        !Number.isSafeInteger(score) || score <= 0 ||
        (achievedAt !== null && (typeof achievedAt !== "string" || !Number.isFinite(Date.parse(achievedAt)))) ||
        (playTimeMs !== null && (!Number.isSafeInteger(playTimeMs) || playTimeMs < 0))) {
      throw new Error("Invalid leaderboard row.");
    }
    return { nickname, score, achievedAt, playTimeMs };
  });
  return { rows };
}
