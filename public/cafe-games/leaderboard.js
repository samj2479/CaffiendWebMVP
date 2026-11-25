(() => {
  if (window.CaffiendGameEntry?.selected !== "merge") return;

  const endpoint = "/api/games/digul/leaderboard";
  const cacheKey = "diguldigul:server-top5:v1";
  const bestKey = "diguldigul:device-best";
  const pendingPrefix = "diguldigul:pending-run:";
  const pending = new Map();
  let rows = null;
  let connected = false;
  let attempted = false;
  let busy = false;
  let timer;
  let retryAfter = 0;
  let onChange;

  function validRows(value) {
    return Array.isArray(value) && value.length <= 5 && value.every(row =>
      row && typeof row.nickname === "string" && /^[가-힣A-Za-z0-9]{2,10}$/.test(row.nickname) &&
      Number.isSafeInteger(row.score) && row.score > 0);
  }

  function readDeviceBest() {
    let best = 0;
    try {
      best = Number(localStorage.getItem(bestKey)) || 0;
      const player = localStorage.getItem("diguldigul:player-id");
      if (player) {
        // Previous releases stored a separate best per local player and week.
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith("diguldigul:best:") && key.endsWith(":" + player)) {
            best = Math.max(best, Number(localStorage.getItem(key)) || 0);
          }
        }
      }
    } catch { /* Storage may be disabled. */ }
    return best;
  }

  let deviceBest = readDeviceBest();
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey));
    if (validRows(cached)) rows = cached;
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith(pendingPrefix)) continue;
      const record = JSON.parse(localStorage.getItem(key));
      if (record?.score > 0 && record.payload?.nickname) pending.set(key, record);
    }
  } catch { /* A fresh or storage-restricted browser can still play. */ }

  function notify() {
    onChange?.({ rows, connected, attempted, pending: pending.size > 0, deviceBest });
  }

  function qualifies(nickname, score) {
    if (!connected || !rows) return true;
    const previous = rows.find(row => row.nickname === nickname);
    return previous ? score > previous.score : rows.length < 5 || score > rows[4].score;
  }

  function forget(key, record) {
    if (pending.get(key) === record) pending.delete(key);
    try {
      // Another tab may have saved a newer snapshot for this run.
      if (JSON.parse(localStorage.getItem(key))?.score === record.score) localStorage.removeItem(key);
    } catch { /* Still retire the in-memory record. */ }
  }

  function schedule() {
    if (!timer && pending.size && !busy && !document.hidden) {
      timer = setTimeout(() => { timer = undefined; sync(); }, Math.max(1500, retryAfter - Date.now()));
    }
  }

  async function sync(readFirst = false) {
    if (busy) return;
    clearTimeout(timer);
    timer = undefined;
    busy = true;
    const next = readFirst === true ? null : pending.entries().next().value;
    const [key, record] = next || [];
    try {
      const options = { cache: "no-store", signal: AbortSignal.timeout(8000) };
      if (record) {
        options.method = "POST";
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(record.payload);
        options.keepalive = true;
      }
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        if (record && [400, 413, 422].includes(response.status)) forget(key, record);
        throw new Error("Leaderboard unavailable");
      }
      const data = await response.json();
      if (!validRows(data.rows)) throw new Error("Invalid leaderboard");
      rows = data.rows;
      connected = true;
      retryAfter = 0;
      try { localStorage.setItem(cacheKey, JSON.stringify(rows)); } catch { /* The live rows still work. */ }
      if (record) forget(key, record);
      for (const [pendingKey, saved] of pending) {
        if (!qualifies(saved.payload.nickname, saved.score)) forget(pendingKey, saved);
      }
    } catch {
      connected = false;
      retryAfter = Date.now() + 15000;
    } finally {
      busy = false;
      attempted = true;
      notify();
      schedule();
    }
  }

  function record(runId, nickname, score, drops, merges, playTimeMs) {
    if (score > deviceBest) {
      deviceBest = score;
      try {
        deviceBest = Math.max(deviceBest, Number(localStorage.getItem(bestKey)) || 0);
        localStorage.setItem(bestKey, String(deviceBest));
      } catch { /* Keep the current session's best. */ }
    }
    if (qualifies(nickname, score)) {
      const key = pendingPrefix + runId;
      const update = { score, payload: { nickname, drops: drops.slice(), merges: merges.slice(), playTimeMs } };
      pending.set(key, update);
      try { localStorage.setItem(key, JSON.stringify(update)); } catch { /* Retry in this session. */ }
      schedule();
    }
    notify();
  }

  function connect(render) {
    onChange = render;
    notify();
    // A previous page may already have sent its final keepalive request.
    sync(true);
    setInterval(() => { if (!document.hidden) sync(); }, 15000);
    window.addEventListener("online", sync);
    window.addEventListener("offline", () => { connected = false; attempted = true; notify(); });
    function flushOnLeave() {
      if (pending.size && Date.now() >= retryAfter) sync();
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) flushOnLeave();
      else sync();
    });
    window.addEventListener("pagehide", flushOnLeave);
  }

  window.DigulLeaderboard = { connect, sync, record };
})();
