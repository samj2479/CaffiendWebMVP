import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { leaderboard, scoreFromRun } from "./digul-leaderboard.mjs";

test("every merge, including the final pair, earns the same points as the game", () => {
  const window = {};
  const configFile = new URL("../../public/cafe-games/config.js", import.meta.url);
  runInNewContext(readFileSync(configFile, "utf8"), { window });
  const { menus, gameplay } = window.DIGUL_CONFIG;

  for (let target = 0; target < menus.length; target++) {
    const merges = Array(menus.length).fill(0);
    let expected = 0;
    for (let level = 0; level <= target; level++) {
      merges[level] = 2 ** (target - level);
      expected += merges[level] * (menus[level + 1]?.points ?? gameplay.completionBonus);
    }
    const drops = Array(gameplay.droppableLevels).fill(0);
    drops[0] = 2 * merges[0];
    assert.deepEqual(scoreFromRun({ nickname: "Tester", drops, merges }), { nickname: "Tester", score: expected, playTimeMs: null });
    drops[0]--;
    assert.equal(scoreFromRun({ nickname: "Tester", drops, merges }), null);
  }
});

test("elapsed time accepts nonnegative integer milliseconds and permits older clients to omit it", () => {
  const run = { nickname: "Tester", drops: [2, 0, 0, 0, 0], merges: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
  for (const playTimeMs of [0, 1, 61_234]) {
    assert.deepEqual(scoreFromRun({ ...run, playTimeMs }), { nickname: "Tester", score: 3, playTimeMs });
  }
  for (const playTimeMs of [-1, 0.5, "100", null, true, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(scoreFromRun({ ...run, playTimeMs }), null);
  }
  assert.equal(scoreFromRun(run).playTimeMs, null);
});

function useTestDatabase(t) {
  const dir = mkdtempSync(join(tmpdir(), "digul-ranking-test-"));
  const file = join(dir, "scores.sqlite3");
  const previousPath = process.env.DIGUL_LEADERBOARD_DB_PATH;
  process.env.DIGUL_LEADERBOARD_DB_PATH = file;
  t.after(() => {
    if (previousPath === undefined) delete process.env.DIGUL_LEADERBOARD_DB_PATH;
    else process.env.DIGUL_LEADERBOARD_DB_PATH = previousPath;
    rmSync(file, { force: true });
    rmdirSync(dir);
  });
  return file;
}

test("the five best distinct nicknames survive retries and equal scores keep arrival order", t => {
  useTestDatabase(t);

  for (const [nickname, score] of [["Peach", 30], ["Mint", 24], ["Bean", 24], ["Mocha", 18], ["Mango", 12], ["Melon", 9]]) {
    leaderboard({ nickname, score });
  }
  leaderboard({ nickname: "Mint", score: 24 });
  leaderboard({ nickname: "Peach", score: 3 });
  leaderboard({ nickname: "Melon", score: 24 });
  assert.deepEqual(leaderboard().rows.map(({ nickname, score }) => [nickname, score]), [
    ["Peach", 30], ["Mint", 24], ["Bean", 24], ["Melon", 24], ["Mocha", 18],
  ]);
});

test("legacy personal bests and tie order survive migration, retries and reopening", t => {
  const file = useTestDatabase(t);
  const legacy = new DatabaseSync(file);
  try {
    legacy.exec(`
      CREATE TABLE digul_best (
        nickname TEXT PRIMARY KEY NOT NULL,
        score INTEGER NOT NULL CHECK (score > 0),
        reached_order INTEGER NOT NULL
      );
      INSERT INTO digul_best VALUES ('Mint', 30, 2), ('Bean', 30, 1);
    `);
  } finally {
    legacy.close();
  }

  const original = [
    { nickname: "Bean", score: 30, achievedAt: null, playTimeMs: null },
    { nickname: "Mint", score: 30, achievedAt: null, playTimeMs: null },
  ];
  const plainRows = result => result.rows.map(row => ({ ...row }));
  assert.deepEqual(plainRows(leaderboard()), original);
  assert.deepEqual(plainRows(leaderboard({ nickname: "Mint", score: 30, playTimeMs: 99 })), original);

  const start = Date.now();
  const record = leaderboard({ nickname: "Mint", score: 33, playTimeMs: 12_345 }).rows[0];
  const timestamp = Date.parse(record.achievedAt);
  assert.ok(timestamp >= start && timestamp <= Date.now());
  assert.equal(record.achievedAt, new Date(timestamp).toISOString());
  assert.equal(record.playTimeMs, 12_345);
  for (const score of [33, 30]) {
    assert.deepEqual(leaderboard({ nickname: "Mint", score, playTimeMs: 50 }).rows[0], record);
  }
  assert.deepEqual(leaderboard().rows[0], record);

  const oldClient = leaderboard({ nickname: "Bean", score: 33 }).rows[1];
  assert.equal(oldClient.playTimeMs, null);
  assert.ok(Number.isFinite(Date.parse(oldClient.achievedAt)));
  assert.deepEqual(plainRows(leaderboard()).map(row => row.nickname), ["Mint", "Bean"]);
});
