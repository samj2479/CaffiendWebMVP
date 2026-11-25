(() => {
  if (window.CaffiendGameEntry?.selected !== "merge") return;
  const CONFIG = window.DIGUL_CONFIG;
  const EXP = window.DigulExperience;
  const BOARD = window.DigulLeaderboard;
  const ANALYTICS = window.DigulAnalytics;
  const SPRITES = window.DigulSpriteRenderer;
  if (!CONFIG || !EXP || !BOARD || !SPRITES || !window.Matter) {
    console.error("DIGUL boot dependency missing", {
      config:!!CONFIG, experience:!!EXP, leaderboard:!!BOARD, sprites:!!SPRITES, matter:!!window.Matter
    });
    return;
  }

  const $ = id => document.getElementById(id);
  const {
    Engine, Bodies, Composite, Events, Body
  } = Matter;

  const menus = CONFIG.menus.map((menu, index) => ({
    ...menu,
    index,
    radius: CONFIG.physics.baseRadius * menu.diameter,
    image: null,
    imageFailed: false
  }));

  const state = {
    score:0,
    runNickname:"",
    drops:[],
    merges:[],
    currentLevel:0,
    nextLevel:0,
    dropX:CONFIG.physics.width / 2,
    canDrop:true,
    gameOver:false,
    gameStarted:false,
    elapsedPlayMs:0,
    activeSince:null,
    dangerMs:0,
    maxLevel:0,
    gameId:"",
    pressing:false,
    pauseReasons:new Set(),
    lastLeaderboard:null,
    firstDrop:true,
    frameCount:0,
    dessertDraws:0,
    lastDessertDrawAt:0
  };

  const els = {
    game:$("gameScreen"), nicknameButton:$("nicknameButton"), nicknameDisplay:$("nicknameDisplay"),
    pauseButton:$("pauseButton"), score:$("scoreValue"), personalBest:$("personalBestValue"),
    nextPreview:$("nextPreview"), recipeButtonPreview:$("recipeButtonPreview"), canvas:$("gameCanvas"), boardWrap:document.querySelector(".board-wrap"),
    spriteLayer:$("spriteLayer"), dropSprite:$("dropSprite"),
    recipeButton:$("recipeButton"), rankingButton:$("rankingButton"),
    resultOverlay:$("resultOverlay"), resultScore:$("resultScore"), resultTopScore:$("resultTopScore"),
    resultRank:$("resultRank"), resultMenuThumb:$("resultMenuThumb"), resultMenuName:$("resultMenuName"),
    restartButton:$("restartButton"), pauseOverlay:$("pauseOverlay"), resumeButton:$("resumeButton"),
    nicknameOverlay:$("nicknameOverlay"), nicknameEditInput:$("nicknameEditInput"), nicknameEditError:$("nicknameEditError"),
    saveNicknameButton:$("saveNicknameButton"), recipeOverlay:$("recipeOverlay"), recipeList:$("recipeList"),
    rankingOverlay:$("rankingOverlay"), rankingStatus:$("rankingStatus"), rankingList:$("rankingList"),
    soundToggle:$("soundToggle"), soundToggleText:$("soundToggleText")
  };

  const ctx = els.canvas.getContext("2d");
  const engine = Engine.create();
  engine.gravity.y = CONFIG.physics.gravity;
  const world = engine.world;
  const W = CONFIG.physics.width;
  const H = CONFIG.physics.height;
  const wallOpt = { isStatic:true, friction:.32, restitution:.04, label:"wall" };

  Composite.add(world, [
    Bodies.rectangle(-28, H / 2, 56, H * 3, wallOpt),
    Bodies.rectangle(W + 28, H / 2, 56, H * 3, wallOpt),
    Bodies.rectangle(W / 2, H + 24, W + 100, 48, wallOpt)
  ]);

  let renderScale = 1;
  let dpr = 1;
  let lastFrame = performance.now();
  let accumulator = 0;
  const STEP = 1000 / 60;
  const mergeQueue = [];
  const fx = [];

  /* ---------- 효과음 (파일 없이 브라우저에서 바로 합성) ---------- */
  const SFX = (() => {
    const KEY = "diguldigul:sound";
    let enabled = true;
    try { enabled = localStorage.getItem(KEY) !== "off"; } catch (_) {}
    let ac = null, master = null, lastMerge = 0, lastDrop = 0;
    // 레벨이 오를수록 한 음씩 올라가는 5음 음계
    const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26];

    function ctx() {
      if (!enabled) return null;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ac) {
        try {
          ac = new AC();
          master = ac.createGain();
          master.gain.value = .55;
          const comp = ac.createDynamicsCompressor();
          master.connect(comp); comp.connect(ac.destination);
        } catch (_) { ac = null; return null; }
      }
      if (ac.state === "suspended") ac.resume().catch(() => {});
      return ac;
    }
    function tone(c, { type = "sine", from, to, start = 0, dur = .12, vol = .25, attack = .004 }) {
      const t = c.currentTime + start;
      const osc = c.createOscillator(), g = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(from, t);
      if (to && to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + dur * .8);
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + attack);
      g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      osc.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + dur + .02);
    }
    return {
      unlock() { ctx(); },
      get enabled() { return enabled; },
      setEnabled(v) {
        enabled = !!v;
        try { localStorage.setItem(KEY, enabled ? "on" : "off"); } catch (_) {}
        if (!enabled && ac) ac.suspend?.().catch(() => {});
        if (enabled) ctx();
      },
      // 떨어뜨릴 때: 짧고 높은 "뽁"
      drop(level = 0) {
        const c = ctx(); if (!c) return;
        const now = performance.now(); if (now - lastDrop < 60) return; lastDrop = now;
        // 짧게 위로 튀는 "뽁" — 높고 발랄한 음
        const base = 900 - level * 35;
        tone(c, { type:"sine", from:base * .85, to:base * 1.4, dur:.085, vol:.32 });
        tone(c, { type:"triangle", from:base * 2, to:base * 2.4, dur:.03, vol:.06 });
      },
      // 합쳐질 때: 레벨에 따라 음이 올라가는 "뾰롱"
      merge(toLevel = 1, completed = false) {
        const c = ctx(); if (!c) return;
        const now = performance.now(); if (now - lastMerge < 45) return; lastMerge = now;
        if (completed) {
          [0, 4, 7, 12, 16].forEach((st, i) => {
            const f = 523.25 * Math.pow(2, st / 12);
            tone(c, { type:"triangle", from:f, to:f, start:i * .075, dur:.32, vol:.2 });
            tone(c, { type:"sine", from:f * 2, to:f * 2, start:i * .075, dur:.22, vol:.06 });
          });
          return;
        }
        const st = SCALE[Math.max(0, Math.min(SCALE.length - 1, toLevel - 1))];
        const f = 392 * Math.pow(2, st / 12);
        tone(c, { type:"sine", from:f * .82, to:f, dur:.07, vol:.26, attack:.003 });
        tone(c, { type:"triangle", from:f * 1.5, to:f * 1.5, start:.055, dur:.22, vol:.16 });
        tone(c, { type:"sine", from:f * 2, to:f * 2, start:.055, dur:.16, vol:.06 });
        if (toLevel >= 8) tone(c, { type:"sine", from:f * 3, to:f * 3, start:.11, dur:.28, vol:.07 });
      }
    };
  })();

  function syncSoundToggle() {
    if (!els.soundToggle) return;
    els.soundToggle.setAttribute("aria-pressed", String(SFX.enabled));
    els.soundToggle.classList.toggle("is-off", !SFX.enabled);
    els.soundToggleText.textContent = SFX.enabled ? "효과음 켜짐" : "효과음 꺼짐";
  }

  function track(event, meta = {}) {
    ANALYTICS?.track?.(event, { gameId:state.gameId, score:state.score, ...meta });
  }

  function loadAssets() {
    SPRITES.load().then(() => {
      updateNextPreview();
      menuThumb(els.recipeButtonPreview, 0, 48);
      renderRecipe();
    });
  }

  function menuThumb(target, level, size = 48) {
    SPRITES.mount(target, level, size);
  }

  function createInlineThumb(level) {
    const el = document.createElement("div");
    el.className = "thumb menu-sprite";
    SPRITES.mount(el, level, 52);
    return el;
  }

  function showGameScreen() {
    document.querySelectorAll(".screen.active").forEach(screen => screen.classList.remove("active"));
    els.game.classList.add("active");
    resizeCanvas();
    requestAnimationFrame(resizeCanvas);
    setTimeout(resizeCanvas, 60);
  }

  function openLayer(el, pauseReason) {
    if (el.classList.contains("sheet")) el.classList.add("show");
    else el.classList.add("show");
    el.setAttribute("aria-hidden", "false");
    if (pauseReason) addPause(pauseReason);
  }

  function closeLayer(el, pauseReason) {
    el.classList.remove("show");
    el.setAttribute("aria-hidden", "true");
    if (pauseReason) removePause(pauseReason);
  }

  function addPause(reason) {
    state.pauseReasons.add(reason);
    updatePlayClock();
    if (state.gameStarted && !state.gameOver) {
      els.pauseButton.textContent = "▶";
    }
  }

  function removePause(reason) {
    state.pauseReasons.delete(reason);
    updatePlayClock();
    if (state.pauseReasons.size === 0 && state.gameStarted && !state.gameOver) {
      els.pauseButton.textContent = "Ⅱ";
      lastFrame = performance.now();
    }
  }

  function isPaused() {
    return state.pauseReasons.size > 0;
  }

  function updatePlayClock() {
    const now = performance.now();
    const playing = state.gameStarted && !state.gameOver && !isPaused();
    if (playing && state.activeSince === null) {
      state.activeSince = now;
    } else if (!playing && state.activeSince !== null) {
      state.elapsedPlayMs += now - state.activeSince;
      state.activeSince = null;
    }
  }

  function currentPlayTimeMs() {
    const active = state.activeSince === null ? 0 : performance.now() - state.activeSince;
    return Math.floor(state.elapsedPlayMs + active);
  }

  function resizeCanvas() {
    const rect = els.boardWrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderScale = Math.min(rect.width / W, rect.height / H);
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    const cssW = Math.floor(W * renderScale);
    const cssH = Math.floor(H * renderScale);
    els.canvas.style.width = `${cssW}px`;
    els.canvas.style.height = `${cssH}px`;
    els.canvas.style.margin = "0 auto";
    els.canvas.width = Math.max(1, Math.floor(cssW * dpr));
    els.canvas.height = Math.max(1, Math.floor(cssH * dpr));

    const offsetX = Math.max(0, (rect.width - cssW) / 2);
    // 유리병 테두리(기둥·입구)를 실제 게임판 크기에 딱 맞춥니다.
    els.boardWrap.style.setProperty("--board-x", `${offsetX}px`);
    els.boardWrap.style.setProperty("--board-w", `${cssW}px`);
    els.boardWrap.style.setProperty("--board-h", `${cssH}px`);
    els.spriteLayer.style.left = `${offsetX}px`;
    els.spriteLayer.style.width = `${W}px`;
    els.spriteLayer.style.height = `${H}px`;
    els.spriteLayer.style.transform = `scale(${renderScale})`;
    syncSprites();
  }

  window.addEventListener("resize", resizeCanvas);

  function randomDropLevel() {
    return Math.floor(Math.random() * CONFIG.gameplay.droppableLevels);
  }

  function isItem(body) {
    return body.plugin && Number.isInteger(body.plugin.level);
  }

  function visualSize(level) {
    const menu = menus[level];
    return menu.radius * 2 * (menu.fit || 1.1);
  }

  function createSpriteElement(level, size, className) {
    const el = document.createElement("div");
    el.className = className;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    SPRITES.mount(el, level, Math.round(size));
    return el;
  }

  function createBody(level, x, y) {
    const menu = menus[level];
    const body = Bodies.circle(x, y, menu.radius, {
      restitution:CONFIG.physics.restitution,
      friction:CONFIG.physics.friction,
      frictionStatic:CONFIG.physics.frictionStatic,
      density:CONFIG.physics.density,
      label:`menu-${level + 1}`
    });
    const size = visualSize(level);
    const spriteEl = createSpriteElement(level, size, "physics-dessert");
    els.spriteLayer.appendChild(spriteEl);
    body.plugin = {
      level,
      bornAt:performance.now(),
      merging:false,
      bodyId:crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      spriteEl,
      visualSize:size
    };
    Composite.add(world, body);
    syncBodySprite(body);
    return body;
  }

  function removeBodySprite(body) {
    body?.plugin?.spriteEl?.remove?.();
    if (body?.plugin) body.plugin.spriteEl = null;
  }

  function clearItems() {
    Composite.allBodies(world).filter(isItem).forEach(body => {
      removeBodySprite(body);
      Composite.remove(world, body);
    });
    els.spriteLayer.querySelectorAll(".physics-dessert").forEach(el => el.remove());
    els.dropSprite.innerHTML = "";
    els.dropSprite.classList.remove("is-visible");
    mergeQueue.length = 0;
    fx.length = 0;
  }

  function syncBodySprite(body) {
    if (!isItem(body) || !body.plugin.spriteEl) return;
    const size = body.plugin.visualSize || visualSize(body.plugin.level);
    body.plugin.spriteEl.style.transform =
      `translate3d(${body.position.x - size / 2}px,${body.position.y - size / 2}px,0) rotate(${body.angle}rad)`;
  }

  function mountDropSprite() {
    const level = state.currentLevel;
    const size = visualSize(level);
    els.dropSprite.innerHTML = "";
    els.dropSprite.style.width = `${size}px`;
    els.dropSprite.style.height = `${size}px`;
    SPRITES.mount(els.dropSprite, level, Math.round(size));
    syncDropSprite();
  }

  function syncDropSprite() {
    if (!els.dropSprite) return;
    if (!state.gameStarted || state.gameOver) {
      els.dropSprite.classList.remove("is-visible", "is-cooling");
      return;
    }
    els.dropSprite.classList.toggle("is-cooling", !state.canDrop);
    const size = visualSize(state.currentLevel);
    const x = clampDropX(state.dropX);
    els.dropSprite.style.transform =
      `translate3d(${x - size / 2}px,${CONFIG.physics.dropY - size / 2}px,0)`;
    els.dropSprite.classList.add("is-visible");
  }

  function syncSprites() {
    for (const body of Composite.allBodies(world)) {
      if (isItem(body)) syncBodySprite(body);
    }
    syncDropSprite();
  }

  function clampDropX(x) {
    const radius = menus[state.currentLevel].radius;
    return Math.max(radius + 2, Math.min(W - radius - 2, x));
  }

  function updateScore(value) {
    state.score = Math.max(0, Math.round(value));
    els.score.textContent = state.score.toLocaleString("ko-KR");
  }

  function updateNextPreview() {
    menuThumb(els.nextPreview, state.nextLevel, 70);
  }

  function renderRecipe() {
    els.recipeList.innerHTML = "";
    menus.forEach((menu, index) => {
      const row = document.createElement("div");
      row.className = `recipe-row${index <= state.maxLevel ? " reached" : ""}`;
      const num = document.createElement("span");
      num.className = "num";
      num.textContent = String(index + 1).padStart(2, "0");
      row.appendChild(num);
      row.appendChild(createInlineThumb(index));
      const text = document.createElement("div");
      text.innerHTML = `<strong>${menu.name}</strong><br><small>${index === 0 ? "START" : `+${menu.points}`}</small>`;
      row.appendChild(text);
      const arrow = document.createElement("small");
      arrow.textContent = index === menus.length - 1 ? "★" : "→";
      row.appendChild(arrow);
      els.recipeList.appendChild(row);
    });
  }

  const english = new URLSearchParams(location.search).get("lang") === "en";
  const t = (ko, en) => english ? en : ko;
  const number = value => value.toLocaleString(english ? "en-US" : "ko-KR");
  const dateFormat = new Intl.DateTimeFormat("sv-SE", {
    timeZone: CONFIG.timezone, year: "numeric", month: "2-digit", day: "2-digit"
  });

  function formatPlayTime(ms) {
    if (!Number.isSafeInteger(ms) || ms < 0) return "—";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const mm = String(minutes % 60).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return minutes >= 60 ? Math.floor(minutes / 60) + ":" + mm + ":" + ss : mm + ":" + ss;
  }

  function renderRanking(snapshot = state.lastLeaderboard) {
    if (!snapshot) return;
    state.lastLeaderboard = snapshot;
    const { rows, connected, attempted, pending, deviceBest } = snapshot;
    const top = rows?.[0];
    const rank = rows?.findIndex(row => row.nickname === state.runNickname) ?? -1;
    const offline = attempted && !connected;
    const empty = rows ? t("아직 기록이 없어요.", "No scores yet.") :
      offline ? t("서버 순위를 불러올 수 없어요.", "Server rankings unavailable.") : t("불러오는 중…", "Loading…");
    const status = !connected && rows ? t("마지막 확인", "Last seen") : !rows ? empty : !rows.length ? empty : "";
    $("topFiveStatus").textContent = status;
    els.personalBest.textContent = number(deviceBest);
    els.resultTopScore.textContent = top ? number(top.score) : "—";
    $("resultTopName").textContent = top?.nickname || "";
    els.resultRank.textContent = rank >= 0 ? "#" + (rank + 1) : "—";
    $("resultRankStatus").textContent = pending ? t("서버 저장 대기 중", "Waiting to save") : status;
    els.rankingStatus.textContent = status;
    els.rankingList.replaceChildren();
    const strip = $("topFiveRows");
    strip.replaceChildren();
    for (const [index, row] of (rows || []).entries()) {
      const compact = document.createElement("li");
      const name = document.createElement("span");
      const score = document.createElement("strong");
      name.textContent = (index + 1) + ". " + row.nickname;
      compact.title = name.textContent + " · " + number(row.score);
      score.textContent = number(row.score);
      compact.append(name, score);
      strip.append(compact);

      const item = els.rankingList.insertRow();
      item.classList.toggle("mine", index === rank);
      const achievedAt = Date.parse(row.achievedAt);
      item.insertCell().textContent = Number.isFinite(achievedAt) ? dateFormat.format(achievedAt) : "—";
      item.insertCell().textContent = row.nickname;
      item.insertCell().textContent = formatPlayTime(row.playTimeMs);
      item.insertCell().textContent = number(row.score);
    }
  }

  function beginGame() {
    clearItems();
    state.gameId = EXP.newGameId();
    state.runNickname = EXP.getNickname();
    els.nicknameDisplay.textContent = state.runNickname;
    state.drops = Array(CONFIG.gameplay.droppableLevels).fill(0);
    state.merges = Array(menus.length).fill(0);
    state.score = 0;
    state.currentLevel = randomDropLevel();
    state.nextLevel = randomDropLevel();
    state.dropX = W / 2;
    state.canDrop = true;
    state.gameOver = false;
    state.gameStarted = true;
    state.dangerMs = 0;
    state.maxLevel = 0;
    state.firstDrop = true;
    state.elapsedPlayMs = 0;
    state.activeSince = null;
    state.pauseReasons.clear();
    if (document.hidden) addPause("hidden");
    if (!document.hasFocus()) addPause("blur");
    updateScore(0);
    closeLayer(els.resultOverlay);
    closeLayer(els.pauseOverlay, "manual");
    updateNextPreview();
    menuThumb(els.recipeButtonPreview, 0, 48);
    renderRecipe();
    mountDropSprite();
    lastFrame = performance.now();
    drawBoard(lastFrame);
    track("game_start");

    renderRanking();
  }

  function dropCurrent() {
    if (!state.gameStarted || state.gameOver || isPaused() || !state.canDrop) return;
    createBody(state.currentLevel, clampDropX(state.dropX), CONFIG.physics.dropY);
    SFX.drop(state.currentLevel);
    state.drops[state.currentLevel] += 1;
    state.currentLevel = state.nextLevel;
    state.nextLevel = randomDropLevel();
    updateNextPreview();
    state.canDrop = false;
    mountDropSprite();
    if (state.firstDrop) {
      state.firstDrop = false;
    }
    setTimeout(() => {
      state.canDrop = true;
      mountDropSprite();
    }, CONFIG.physics.dropCooldownMs);
  }

  function onCollision(event) {
    for (const pair of event.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      if (!isItem(a) || !isItem(b)) continue;
      if (a.plugin.level !== b.plugin.level) continue;
      if (a.plugin.merging || b.plugin.merging) continue;
      a.plugin.merging = true;
      b.plugin.merging = true;
      mergeQueue.push([a, b]);
    }
  }

  Events.on(engine, "collisionStart", onCollision);
  Events.on(engine, "collisionActive", onCollision);

  function bodyStillExists(body) {
    return Composite.allBodies(world).includes(body);
  }

  function processMerges() {
    while (mergeQueue.length) {
      const [a, b] = mergeQueue.shift();
      if (!bodyStillExists(a) || !bodyStillExists(b)) continue;
      const level = a.plugin.level;
      const x = (a.position.x + b.position.x) / 2;
      const y = (a.position.y + b.position.y) / 2;
      const velocity = {
        x:(a.velocity.x + b.velocity.x) / 2,
        y:(a.velocity.y + b.velocity.y) / 2
      };

      removeBodySprite(a);
      removeBodySprite(b);
      Composite.remove(world, a);
      Composite.remove(world, b);

      let points = 0;
      let toLevel = null;
      if (level < menus.length - 1) {
        toLevel = level + 1;
        const created = createBody(toLevel, x, Math.max(y, menus[toLevel].radius + 2));
        Body.setVelocity(created, velocity);
        points = menus[toLevel].points;
        if (toLevel > state.maxLevel) {
          state.maxLevel = toLevel;
          renderRecipe();
        }
      } else {
        points = CONFIG.gameplay.completionBonus;
      }

      SFX.merge(toLevel === null ? menus.length : toLevel + 1, toLevel === null);
      updateScore(state.score + points);
      state.merges[level] += 1;
      BOARD.record(state.gameId, state.runNickname, state.score, state.drops, state.merges, currentPlayTimeMs());
      fx.push({ x, y, points, born:performance.now() });
      track("merge", { fromLevel:level + 1, toLevel:toLevel === null ? 0 : toLevel + 1, points });
    }
  }

  function checkDanger(dt) {
    if (!state.gameStarted || state.gameOver || isPaused()) return;
    const now = performance.now();
    const above = Composite.allBodies(world).some(body =>
      isItem(body) &&
      now - body.plugin.bornAt > CONFIG.physics.freshBodyGraceMs &&
      body.position.y - body.circleRadius < CONFIG.physics.dangerY
    );
    state.dangerMs = above ? state.dangerMs + dt : 0;
    if (state.dangerMs >= CONFIG.physics.dangerHoldMs) endGame();
  }

  function endGame() {
    if (state.gameOver) return;
    state.gameOver = true;
    updatePlayClock();
    state.canDrop = false;
    els.resultScore.textContent = number(state.score);
    renderRanking();
    BOARD.sync();
    els.resultMenuName.textContent = menus[state.maxLevel].name;
    menuThumb(els.resultMenuThumb, state.maxLevel, 54);
    openLayer(els.resultOverlay);
    els.restartButton.focus({ preventScroll: true });
    track("game_finish", { maxLevel:state.maxLevel + 1 });
  }

  function drawMenu(level, x, y, angle = 0, alpha = 1) {
    const menu = menus[level];
    const size = visualSize(level);
    SPRITES.draw(ctx, level, x, y, size, angle, alpha);
    state.dessertDraws += 1;
    state.lastDessertDrawAt = performance.now();
  }

  function drawBoard(now) {
    ctx.setTransform(renderScale * dpr, 0, 0, renderScale * dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#fff8ed");
    bg.addColorStop(.58, "#f8e8d4");
    bg.addColorStop(1, "#ecd0ae");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = .20;
    ctx.translate(-70, 80);
    ctx.rotate(-.22);
    const sunlight = ctx.createLinearGradient(0, 0, 0, H);
    sunlight.addColorStop(0, "rgba(255,255,235,.95)");
    sunlight.addColorStop(1, "rgba(255,244,200,0)");
    ctx.fillStyle = sunlight;
    ctx.fillRect(0, 0, 52, H * .82);
    ctx.fillRect(92, 18, 28, H * .70);
    ctx.restore();

    ctx.fillStyle = "rgba(170,110,68,.10)";
    ctx.beginPath();
    ctx.ellipse(W / 2, H - 9, W * .45, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // 넘침 경고: 평소에는 선이 없고, 넘치기 시작했을 때만 위쪽이 붉게 깜빡입니다.
    if (state.dangerMs > 0 && !state.gameOver) {
      const pulse = .10 + .14 * (0.5 + 0.5 * Math.sin(now / 110));
      const warn = ctx.createLinearGradient(0, 0, 0, CONFIG.physics.dangerY);
      warn.addColorStop(0, `rgba(215,90,74,${pulse})`);
      warn.addColorStop(1, "rgba(215,90,74,0)");
      ctx.fillStyle = warn;
      ctx.fillRect(0, 0, W, CONFIG.physics.dangerY);
    }
    // Dessert sprites are rendered in the DOM layer above this canvas.

    syncSprites();

    for (let i = fx.length - 1; i >= 0; i--) {
      const item = fx[i];
      const t = (now - item.born) / 650;
      if (t >= 1) {
        fx.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = 1 - t;
      const pulse = 18 + t * 24;
      ctx.strokeStyle = "rgba(245,183,52,.9)";
      ctx.lineWidth = Math.max(1, 3 - t * 2);
      ctx.beginPath();
      ctx.arc(item.x, item.y, pulse, 0, Math.PI * 2);
      ctx.stroke();

      for (let s = 0; s < 6; s++) {
        const a = s * Math.PI / 3 + t * .7;
        const rr = 16 + t * 32;
        ctx.fillStyle = s % 2 ? "#fff1a6" : "#f4aa31";
        ctx.beginPath();
        ctx.arc(item.x + Math.cos(a) * rr, item.y + Math.sin(a) * rr, 2.6 * (1 - t * .55), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#d9781e";
      ctx.font = "900 18px system-ui";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(255,255,255,.9)";
      ctx.shadowBlur = 5;
      ctx.fillText(`+${item.points}`, item.x, item.y - 10 - t * 28);
      ctx.restore();
    }

    ctx.save();
    ctx.strokeStyle = "rgba(164,104,62,.20)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(15, 112);
    ctx.quadraticCurveTo(10, H * .76, 36, H - 15);
    ctx.moveTo(W - 15, 112);
    ctx.quadraticCurveTo(W - 10, H * .76, W - 36, H - 15);
    ctx.stroke();
    ctx.restore();
  }

  function frame(now) {
    state.frameCount += 1;
    const dt = Math.min(now - lastFrame, 100);
    lastFrame = now;
    if (state.gameStarted && !state.gameOver && !isPaused()) {
      accumulator += dt;
      while (accumulator >= STEP) {
        Engine.update(engine, STEP);
        processMerges();
        accumulator -= STEP;
      }
      checkDanger(dt);
    }
    drawBoard(now);
    requestAnimationFrame(frame);
  }

  function pointerToWorldX(event) {
    const rect = els.canvas.getBoundingClientRect();
    return ((event.clientX - rect.left) / rect.width) * W;
  }

  // 손가락을 따라 디저트가 바로 움직이도록 게임판 전체에서 입력을 받습니다.
  function moveAim(event) {
    state.dropX = clampDropX(pointerToWorldX(event));
    syncDropSprite();
  }

  els.boardWrap.addEventListener("pointerdown", event => {
    SFX.unlock();
    if (!state.gameStarted || state.gameOver || isPaused()) return;
    state.pressing = true;
    moveAim(event);
    els.boardWrap.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  els.boardWrap.addEventListener("pointermove", event => {
    if (!state.gameStarted || state.gameOver || isPaused()) return;
    // 마우스는 누르지 않아도 따라오고, 터치는 누른 채 끌 때 따라옵니다.
    if (!state.pressing && event.pointerType !== "mouse") return;
    moveAim(event);
    event.preventDefault();
  });

  els.boardWrap.addEventListener("pointerup", event => {
    if (!state.pressing || state.gameOver || isPaused()) return;
    state.pressing = false;
    moveAim(event);
    dropCurrent();
    event.preventDefault();
  });

  els.boardWrap.addEventListener("pointercancel", () => {
    state.pressing = false;
  });

  function validateAndSave(input, errorEl) {
    const checked = EXP.setNickname(input.value);
    errorEl.textContent = checked.reason || "";
    if (!checked.ok) return null;
    return checked.value;
  }

  els.pauseButton.addEventListener("click", () => {
    if (state.gameOver) return;
    if (state.pauseReasons.has("manual")) {
      closeLayer(els.pauseOverlay, "manual");
    } else {
      openLayer(els.pauseOverlay, "manual");
    }
  });

  els.resumeButton.addEventListener("click", () => closeLayer(els.pauseOverlay, "manual"));
  els.soundToggle?.addEventListener("click", () => {
    SFX.setEnabled(!SFX.enabled);
    syncSoundToggle();
    if (SFX.enabled) SFX.merge(3);
  });
  els.restartButton.addEventListener("click", beginGame);
  $("digulHomeButton").addEventListener("click", () => track("return_home"));

  els.nicknameButton.addEventListener("click", () => {
    els.nicknameEditInput.value = EXP.getNickname();
    els.nicknameEditError.textContent = "";
    $("nicknameRankHint").hidden = state.score === 0;
    openLayer(els.nicknameOverlay, "nickname");
  });

  els.saveNicknameButton.addEventListener("click", () => {
    const nickname = validateAndSave(els.nicknameEditInput, els.nicknameEditError);
    if (!nickname) return;
    if (state.score === 0) {
      state.runNickname = nickname;
      els.nicknameDisplay.textContent = nickname;
    }
    closeLayer(els.nicknameOverlay, "nickname");
    track("nickname_change");
    renderRanking();
  });

  els.recipeButton.addEventListener("click", () => {
    renderRecipe();
    openLayer(els.recipeOverlay, "recipe");
    track("recipe_open");
  });

  els.rankingButton.addEventListener("click", () => {
    openLayer(els.rankingOverlay, "ranking");
    BOARD.sync();
    track("ranking_open");
  });

  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.close;
      const el = $(id);
      const reason = id === "recipeOverlay" ? "recipe" : id === "rankingOverlay" ? "ranking" : id === "nicknameOverlay" ? "nickname" : "";
      closeLayer(el, reason);
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) addPause("hidden");
    else removePause("hidden");
  });
  window.addEventListener("blur", () => addPause("blur"));
  window.addEventListener("focus", () => removePause("blur"));

  function diagnostics() {
    return {
      version:CONFIG.version,
      renderer:SPRITES.status(),
      rendererTest:SPRITES.selfTest(),
      frameCount:state.frameCount,
      dessertDraws:state.dessertDraws,
      lastDessertDrawAt:state.lastDessertDrawAt,
      canvas:{
        width:els.canvas.width,
        height:els.canvas.height,
        cssWidth:els.canvas.getBoundingClientRect().width,
        cssHeight:els.canvas.getBoundingClientRect().height
      },
      domSprites:{
        physics:els.spriteLayer.querySelectorAll(".physics-dessert").length,
        dropVisible:els.dropSprite.classList.contains("is-visible"),
        dropChildren:els.dropSprite.childElementCount
      },
      gameStarted:state.gameStarted,
      bodies:Composite.allBodies(world).filter(isItem).length,
      currentLevel:state.currentLevel + 1,
      nextLevel:state.nextLevel + 1
    };
  }
  window.__DIGUL_DIAGNOSTICS__ = diagnostics;

  function boot() {
    loadAssets();
    syncSoundToggle();
    const saved = EXP.getNickname();
    els.nicknameDisplay.textContent = saved || "PLAYER";
    menuThumb(els.recipeButtonPreview, 0, 48);
    renderRecipe();

    // Rendering starts immediately and never waits for network or leaderboard work.
    resizeCanvas();
    lastFrame = performance.now();
    requestAnimationFrame(frame);

    BOARD.connect(renderRanking);
  }

  boot();
  window.CaffiendGameEntry.startWithNickname(nickname => {
    els.nicknameDisplay.textContent = nickname;
    showGameScreen();
    beginGame();
  });
})();
