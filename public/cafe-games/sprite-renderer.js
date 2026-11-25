(() => {
  const CONFIG = window.DIGUL_CONFIG;
  const ART = window.DigulDessertArt;

  if (!CONFIG || !ART) {
    console.error("DIGUL sprite renderer dependency missing");
    return;
  }

  // 메뉴 이미지(assets/menu/*.webp)를 불러와 그립니다.
  // 이미지가 아직 안 왔거나 실패하면 기존 코드 그림(dessert-art.js)으로 대신 그립니다.
  const base = CONFIG.assets?.base || "assets/menu/";
  const version = CONFIG.version || "";
  const proceduralRender = ART.render;
  const proceduralDrawTo = ART.drawTo;
  const images = CONFIG.menus.map(() => null);
  const waiting = CONFIG.menus.map(() => []);
  let status = "loading";
  const listeners = new Set();

  const clampLevel = level => Math.max(0, Math.min(CONFIG.menus.length - 1, level | 0));
  const ready = level => {
    const img = images[level];
    return img && img.complete && img.naturalWidth > 0;
  };

  function setStatus(next) {
    status = next;
    listeners.forEach(fn => { try { fn(status); } catch (_) {} });
  }

  const loading = Promise.all(CONFIG.menus.map((menu, level) => new Promise(resolve => {
    if (!menu.file) return resolve(false);
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      images[level] = img;
      waiting[level].splice(0).forEach(fn => fn());
      resolve(true);
    };
    img.onerror = () => {
      console.warn("메뉴 이미지를 불러오지 못했어요:", menu.file);
      waiting[level].length = 0;
      resolve(false);
    };
    img.src = `${base}${encodeURIComponent(menu.file)}?v=${version}`;
  }))).then(results => {
    setStatus(results.every(Boolean) ? "image" : results.some(Boolean) ? "image-partial" : "procedural-fallback");
    return status;
  });

  function load() {
    return loading;
  }

  function paint(canvas, level, cssSize) {
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (ready(level)) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(images[level], 0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(proceduralRender(level, cssSize), 0, 0, canvas.width, canvas.height);
    }
  }

  // 정사각형 캔버스 하나를 만들어 메뉴 그림을 그려 돌려줍니다.
  // 이미지가 나중에 도착하면 같은 캔버스를 다시 그려서 자동으로 바뀝니다.
  function renderCanvas(level, size = 256) {
    const safe = clampLevel(level);
    const ratio = Math.min(window.devicePixelRatio || 2, 3);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(size * ratio));
    canvas.height = canvas.width;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    paint(canvas, safe, size);
    if (!ready(safe) && status === "loading") {
      waiting[safe].push(() => paint(canvas, safe, size));
    }
    return canvas;
  }

  function draw(ctx, level, x, y, size, rotation = 0, alpha = 1) {
    const safe = clampLevel(level);
    if (!ready(safe)) {
      proceduralDrawTo(ctx, safe, x, y, size, rotation, alpha);
      return true;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.drawImage(images[safe], -size / 2, -size / 2, size, size);
    ctx.restore();
    return true;
  }

  function mount(target, level, size) {
    if (!target) return;
    const safe = clampLevel(level);
    target.innerHTML = "";
    target.style.width = `${size}px`;
    target.style.height = `${size}px`;
    const canvas = renderCanvas(safe, size);
    canvas.className = "dessert-canvas";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", CONFIG.menus[safe].name);
    target.appendChild(canvas);
  }

  // 디저트 미리보기와 게임판에서 같은 이미지를 사용합니다.
  ART.render = (level, size = 256) => renderCanvas(level, size);
  ART.drawTo = (ctx, level, x, y, size, rotation = 0, alpha = 1) => { draw(ctx, level, x, y, size, rotation, alpha); };

  function onStatus(fn) {
    listeners.add(fn);
    try { fn(status); } catch (_) {}
    return () => listeners.delete(fn);
  }

  function selfTest() {
    const c = document.createElement("canvas");
    c.width = 96;
    c.height = 96;
    const cctx = c.getContext("2d", { willReadFrequently:true });
    draw(cctx, 0, 48, 48, 82, 0, 1);
    const data = cctx.getImageData(0, 0, 96, 96).data;
    let colored = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 30) colored++;
    }
    return { pass:colored > 300, status, coloredPixels:colored };
  }

  window.DigulSpriteRenderer = {
    load,
    draw,
    mount,
    status:() => status,
    onStatus,
    selfTest
  };
})();
