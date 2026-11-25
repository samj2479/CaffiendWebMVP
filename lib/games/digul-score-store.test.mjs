import assert from "node:assert/strict";
import { mkdtempSync, rmdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { loadLeaderboard } from "./digul-score-store.mjs";

function useConfig(t, overrides = {}) {
  const config = {
    VERCEL: "1",
    NODE_ENV: "production",
    DIGUL_LEADERBOARD_DB_PATH: undefined,
    SUPABASE_URL: undefined,
    NEXT_PUBLIC_SUPABASE_URL: "https://digul.invalid",
    SUPABASE_SECRET_KEY: undefined,
    SUPABASE_SERVICE_ROLE_KEY: undefined,
    DIGUL_SUPABASE_SECRET_KEY: "sb_secret_test_fixture",
    ...overrides,
  };
  for (const [name, value] of Object.entries(config)) {
    const previous = process.env[name];
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
    t.after(() => {
      if (previous === undefined) delete process.env[name];
      else process.env[name] = previous;
    });
  }
}

test("hosted reads and zero scores use only the top-five RPC and expose only public score fields", async t => {
  useConfig(t);
  const row = { nickname: "초코", score: 21, achievedAt: "2026-11-25T02:34:30+00:00", playTimeMs: 1500 };
  const request = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url.href, "https://digul.invalid/rest/v1/rpc/digul_leaderboard_top5");
    assert.equal(options.headers.apikey, "sb_secret_test_fixture");
    assert.equal(options.headers.Authorization, undefined);
    assert.equal(options.body, "{}");
    assert.equal(options.cache, "no-store");
    assert.equal(options.redirect, "error");
    return Response.json([{ ...row, extra: "internal" }]);
  });
  assert.deepEqual(await loadLeaderboard(), { rows: [row] });
  assert.deepEqual(await loadLeaderboard({ nickname: "Bean", score: 0 }), { rows: [row] });
  assert.equal(request.mock.callCount(), 2);
});

test("hosted submissions use the server key, computed score and nullable elapsed time", async t => {
  useConfig(t, { DIGUL_SUPABASE_SECRET_KEY: undefined, SUPABASE_SERVICE_ROLE_KEY: "legacy.jwt.fixture" });
  const times = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url.pathname, "/rest/v1/rpc/digul_leaderboard_submit");
    assert.equal(options.method, "POST");
    assert.equal(options.headers.Authorization, "Bearer legacy.jwt.fixture");
    const body = JSON.parse(options.body);
    assert.deepEqual(Object.keys(body).sort(), ["p_nickname", "p_play_time_ms", "p_score"]);
    assert.equal(body.p_nickname, "Bean");
    assert.equal(body.p_score, 3);
    times.push(body.p_play_time_ms);
    return Response.json([]);
  });
  await loadLeaderboard({ nickname: "Bean", score: 3 });
  await loadLeaderboard({ nickname: "Bean", score: 3, playTimeMs: 1000 });
  assert.deepEqual(times, [null, 1000]);
});

test("hosted storage failures are visible and never fall back to a temporary ranking", async t => {
  useConfig(t, { DIGUL_SUPABASE_SECRET_KEY: undefined });
  const request = t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 503 }));
  await assert.rejects(loadLeaderboard());
  assert.equal(request.mock.callCount(), 0);
  process.env.SUPABASE_SECRET_KEY = "sb_secret_test_fixture";
  await assert.rejects(loadLeaderboard(), /database request failed/);
  request.mock.mockImplementation(async () => Response.json([{ nickname: "Bean", score: 3 }]));
  await assert.rejects(loadLeaderboard(), /Invalid leaderboard row/);
});

test("local development keeps records in SQLite even if other site features have Supabase credentials", async t => {
  const directory = mkdtempSync(join(tmpdir(), "digul-local-store-"));
  const previousDir = process.cwd();
  t.after(() => {
    process.chdir(previousDir);
    const dataDirectory = join(directory, ".caffiend-data");
    rmSync(join(dataDirectory, "digul-leaderboard.sqlite3"), { force: true });
    rmdirSync(dataDirectory);
    rmdirSync(directory);
  });
  process.chdir(directory);
  useConfig(t, { VERCEL: undefined, NODE_ENV: "development", DIGUL_SUPABASE_SECRET_KEY: undefined, SUPABASE_SERVICE_ROLE_KEY: "legacy.jwt.fixture" });
  const request = t.mock.method(globalThis, "fetch", () => { throw new Error("Unexpected network call"); });
  const { rows } = await loadLeaderboard({ nickname: "Bean", score: 3, playTimeMs: 900 });
  assert.equal(rows[0].score, 3);
  assert.equal((await loadLeaderboard()).rows[0].playTimeMs, 900);
  assert.equal(request.mock.callCount(), 0);
});
