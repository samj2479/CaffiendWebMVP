import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

// Indexed by source level. The last pair earns the completion bonus.
const MERGE_POINTS = [3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 150];
const topFive = `
  SELECT nickname, score, achieved_at AS achievedAt, play_time_ms AS playTimeMs FROM digul_best
  ORDER BY score DESC, reached_order ASC LIMIT 5
`;

function validCounts(counts, length) {
  return Array.isArray(counts) && counts.length === length &&
    counts.every(value => Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000);
}

export function scoreFromRun(run) {
  if (typeof run?.nickname !== "string") return null;
  const nickname = run.nickname.trim();
  if (!/^[가-힣a-zA-Z0-9]{2,10}$/u.test(nickname) ||
      !validCounts(run.drops, 5) || !validCounts(run.merges, MERGE_POINTS.length)) return null;
  if (run.playTimeMs !== undefined && (!Number.isSafeInteger(run.playTimeMs) || run.playTimeMs < 0)) return null;

  let score = 0;
  for (const [level, points] of MERGE_POINTS.entries()) {
    const available = (run.drops[level] ?? 0) + (run.merges[level - 1] ?? 0);
    if (run.merges[level] * 2 > available) return null;
    score += run.merges[level] * points;
  }
  return { nickname, score, playTimeMs: run.playTimeMs ?? null };
}

function databasePath() {
  const configured = process.env.DIGUL_LEADERBOARD_DB_PATH;
  if (configured) {
    if (!isAbsolute(configured)) throw new Error("An absolute leaderboard database path is required.");
    return configured;
  }
  if (process.env.VERCEL) throw new Error("The leaderboard needs persistent server storage.");
  return join(process.cwd(), ".caffiend-data", "digul-leaderboard.sqlite3");
}

function initializeLeaderboard(db) {
  const version = db.prepare("PRAGMA user_version");
  if (version.get().user_version >= 1) return;

  db.exec("BEGIN IMMEDIATE");
  // Another request may have migrated the old table while this one waited for the lock.
  if (version.get().user_version === 0) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS digul_best (
        nickname TEXT PRIMARY KEY NOT NULL,
        score INTEGER NOT NULL CHECK (score > 0),
        reached_order INTEGER NOT NULL
      );
      ALTER TABLE digul_best ADD COLUMN achieved_at TEXT;
      ALTER TABLE digul_best ADD COLUMN play_time_ms INTEGER CHECK (play_time_ms >= 0);
      PRAGMA user_version = 1;
    `);
  }
  db.exec("COMMIT");
}

/** Open only for one request; an interrupted transaction rolls back on close.
 * @param {{nickname: string, score: number, playTimeMs?: number | null} | null} result
 */
export function leaderboard(result = null) {
  const path = databasePath();
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  try {
    db.exec("PRAGMA busy_timeout = 5000");
    initializeLeaderboard(db);
    if (!result || result.score === 0) return { rows: db.prepare(topFive).all() };

    db.exec("BEGIN IMMEDIATE");
    db.prepare(`
      INSERT INTO digul_best (nickname, score, reached_order, achieved_at, play_time_ms)
      VALUES (?, ?, (SELECT COALESCE(MAX(reached_order), 0) + 1 FROM digul_best), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), ?)
      ON CONFLICT(nickname) DO UPDATE SET
        score = excluded.score, reached_order = excluded.reached_order,
        achieved_at = excluded.achieved_at, play_time_ms = excluded.play_time_ms
      WHERE excluded.score > digul_best.score
    `).run(result.nickname, result.score, result.playTimeMs ?? null);
    db.exec(`
      DELETE FROM digul_best WHERE nickname NOT IN (
        SELECT nickname FROM digul_best ORDER BY score DESC, reached_order ASC LIMIT 5
      );
    `);
    const rows = db.prepare(topFive).all();
    db.exec("COMMIT");
    return { rows };
  } finally {
    db.close();
  }
}
