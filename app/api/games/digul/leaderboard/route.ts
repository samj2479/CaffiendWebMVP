import { scoreFromRun } from "@/lib/games/digul-leaderboard.mjs";
import { loadLeaderboard } from "@/lib/games/digul-score-store.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 2048;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  try {
    return json(await loadLeaderboard());
  } catch {
    return json({ error: "leaderboard_unavailable" }, 503);
  }
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return json({ error: "json_required" }, 415);
  }
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return json({ error: "body_too_large" }, 413);
  }
  if (!request.body) return json({ error: "invalid_run" }, 400);

  const reader = request.body.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  let run: unknown;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return json({ error: "body_too_large" }, 413);
      }
      chunks.push(value);
    }
    run = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return json({ error: "invalid_run" }, 400);
  } finally {
    reader.releaseLock();
  }

  const result = scoreFromRun(run);
  if (!result) return json({ error: "invalid_run" }, 400);
  try {
    return json(await loadLeaderboard(result));
  } catch {
    return json({ error: "leaderboard_unavailable" }, 503);
  }
}
