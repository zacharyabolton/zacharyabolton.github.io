/* A quiet reuse of the segmented wing artwork from scripts/butterflies.js. */
(() => {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  if (!Element.prototype.animate) return;
  const active = new Set();
  const backgroundTags = new Set([
    "HTML",
    "BODY",
    "MAIN",
    "SECTION",
    "ARTICLE",
    "DIV",
    "HEADER",
    "FOOTER",
    "ASIDE",
  ]);
  const controls =
    'a, button, input, textarea, select, label, summary, pre, code, table, p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, [onclick], [tabindex], [contenteditable]:not([contenteditable="false"]), [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="menuitem"], [role="tab"], [role="slider"], [role="textbox"], [role="combobox"]';
  const palettes = [
    ["#c0a6ff", "#d7f86b", "#8e74c5", "#b4cc78"],
    ["#89bfb3", "#d5ba8a", "#577f99", "#bba4ce"],
    ["#d79a97", "#c0a6ff", "#a879a7", "#d8cba7"],
  ];
  let layer = null;
  let press = null;
  let lastSpawn = -Infinity;

  function clear() {
    for (const entry of [...active]) entry.remove();
    press = null;
  }

  document.addEventListener(
    "pointerdown",
    (event) => {
      press =
        event.isPrimary &&
        event.button === 0 &&
        window.getSelection()?.isCollapsed
          ? { x: event.clientX, y: event.clientY, id: event.pointerId }
          : null;
    },
    { passive: true },
  );
  document.addEventListener(
    "pointermove",
    (event) => {
      if (
        press &&
        event.pointerId === press.id &&
        Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6
      )
        press = null;
    },
    { passive: true },
  );
  document.addEventListener(
    "pointercancel",
    () => {
      press = null;
    },
    { passive: true },
  );

  document.addEventListener("click", (event) => {
    const start = press;
    press = null;
    const target = event.target;
    if (
      !start ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.detail !== 1 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      motion.matches ||
      document.hidden ||
      active.size >= 3 ||
      !window.getSelection()?.isCollapsed ||
      !(target instanceof Element) ||
      !backgroundTags.has(target.tagName) ||
      target.closest(controls) ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6 ||
      performance.now() - lastSpawn < 250
    )
      return;
    // A div can itself be a caption or label, rather than empty background.
    if (
      [...target.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      )
    )
      return;
    if (getComputedStyle(target).cursor === "pointer") return;
    lastSpawn = performance.now();
    spawn(event.clientX, event.clientY);
  });

  function spawn(x, y) {
    const width = 34 + Math.random() * 8;
    const [primary, secondary, tertiary, quaternary] =
      palettes[Math.floor(Math.random() * palettes.length)];
    const butterfly = createButterfly(width, {
      primary,
      secondary,
      tertiary,
      quaternary,
    });
    butterfly.setAttribute("aria-hidden", "true");
    butterfly.inert = true;
    butterfly.style.left = `${x - width / 2}px`;
    butterfly.style.top = `${y - width / 2}px`;
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "click-butterfly-layer";
      layer.setAttribute("aria-hidden", "true");
      layer.inert = true;
      document.body.appendChild(layer);
    }
    layer.appendChild(butterfly);

    const side = Math.random() < 0.5 ? -1 : 1;
    const distance = 100 + Math.random() * 130;
    const rise = 180 + Math.random() * 150;
    const duration = 2800 + Math.random() * 600;
    const keyframes = Array.from({ length: 17 }, (_, index) => {
      const t = index / 16;
      const dx = side * (distance * t + Math.sin(t * Math.PI * 3) * 18);
      const dy = -rise * t;
      const tilt = side * (12 + Math.sin(t * Math.PI * 3) * 14);
      return {
        transform: `translate3d(${dx}px, ${dy}px, 0) rotate(${tilt}deg) scale(${1 - t * 0.2})`,
        opacity: Math.min(t * 8, 1, (1 - t) * 4) * 0.8,
        offset: t,
      };
    });
    const flight = butterfly.animate(keyframes, {
      duration,
      easing: "linear",
      fill: "both",
    });
    const entry = {
      remove() {
        clearTimeout(timer);
        flight.cancel();
        butterfly.remove();
        active.delete(entry);
        if (active.size === 0) {
          layer?.remove();
          layer = null;
        }
      },
    };
    const timer = setTimeout(() => entry.remove(), duration + 100);
    active.add(entry);
    flight.onfinish = () => entry.remove();
  }

  motion.addEventListener("change", clear);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clear();
  });
  window.addEventListener("pagehide", clear);
  window.addEventListener("beforeprint", clear);

  function createButterfly(width, colors) {
    const butterfly = document.createElement("div");
    butterfly.style.position = "absolute";
    butterfly.className = "click-butterfly";
    butterfly.style.width = width + "px";

    const wingColors = colors;

    // Scale factors based on original SVG dimensions
    const gap = width / 29.75;
    const forewingWidth = (width - gap) / 2;
    const forewingHeight = width * 0.4496;
    const hindwingHeight = width * 0.4412;
    const hindwingMargin = width * 0.09234;

    // Create wings (left and right)
    ["left", "right"].forEach((side) => {
      const wing = document.createElement("div");
      wing.className = `click-butterfly-wing ${side}`;

      const forewing = document.createElement("div");
      forewing.className = "click-butterfly-forewing";
      forewing.style.width = forewingWidth + "px";
      forewing.style.height = forewingHeight + "px";

      const hindwing = document.createElement("div");
      hindwing.className = "click-butterfly-hindwing";
      hindwing.style.height = hindwingHeight + "px";
      hindwing.style.marginLeft = hindwingMargin + "px";

      // Add wing sections with SVGs
      const sections = createWingSections(wingColors);
      Object.entries(sections.forewing).forEach(([key, svg]) => {
        const section = document.createElement("div");
        section.className = `click-butterfly-piece ${key}`;
        section.innerHTML = svg;
        forewing.appendChild(section);
      });

      Object.entries(sections.hindwing).forEach(([key, svg]) => {
        const section = document.createElement("div");
        section.className = `click-butterfly-piece ${key}`;
        section.innerHTML = svg;
        hindwing.appendChild(section);
      });

      wing.appendChild(forewing);
      wing.appendChild(hindwing);
      butterfly.appendChild(wing);
    });

    return butterfly;
  }

  function createWingSections(colors) {
    return {
      forewing: {
        one: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65.807 71.393">
        <path fill="${colors.primary}" d="M65.807,71.12c-1.816,.09-3.087,.208-4.358,.209-19.133,.012-38.267-.052-57.399,.063-3.418,.02-4.767-.461-3.682-4.396C6.108,46.178,11.581,25.286,17.23,4.442c.449-1.655,.433-4.201,2.549-4.431,1.717-.187,2.227,2.135,3.079,3.464,13.273,20.72,26.515,41.46,39.749,62.205,1.043,1.635,1.971,3.343,3.2,5.441Z"/>
      </svg>`,
        two: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.222 29.065">
        <path fill="${colors.secondary}" d="M57.222,.967C40.762,10.238,24.302,19.509,7.336,29.065,4.871,19.864,2.529,11.072,.154,2.289-.523-.216,1.155,.005,2.678,.005,20.772,.004,38.865,.005,56.959,.005c.088,.321,.176,.642,.263,.964v-.002Z"/>
      </svg>`,
        three: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121.387 49.732">
        <path fill="${colors.tertiary}" d="M120.877,49.732C81.024,43.684,41.17,37.637,0,31.389,16.813,21.915,32.404,13.082,48.042,4.332c10.823-6.056,10.846-5.997,20.433,1.662,15.998,12.78,32.005,25.549,48.003,38.328,1.652,1.32,3.273,2.678,4.909,4.018-.17,.464-.339,.928-.509,1.392Z"/>
      </svg>`,
        four: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.241 44.672">
        <path fill="${colors.quaternary}" d="M54.209,44.672C36.08,30.192,17.952,15.713,0,1.374,.2,.085,.843,.043,1.517,.043,14.483,.038,27.449,.055,40.415,0c1.8-.008,3.1,.126,3.664,2.271,3.662,13.942,7.429,27.857,11.162,41.781l-1.032,.62Z"/>
      </svg>`,
        five: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 91.601 70.327">
        <path fill="${colors.primary}" d="M0,.291c1.12-.741,1.849,.099,2.606,.68,29.643,22.751,59.28,45.509,88.995,68.325-1.076,1.562-2.493,.884-3.628,.889-12.965,.058-25.932-.095-38.893,.129-3.29,.057-5.044-1.09-6.734-3.759C28.315,44.388,14.147,22.309,.02,.203l-.02,.088Z"/>
      </svg>`,
      },
      hindwing: {
        one: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.002 66.953">
        <path fill="${colors.secondary}" d="M41.873,66.885C28.913,55.695,15.945,44.514,2.999,33.308,.352,31.017-1.058,28.091,.948,24.91,6.07,16.789,11.478,8.848,17.323,0c3.971,10.469,7.592,20.006,11.207,29.545,4.061,10.718,8.147,21.428,12.142,32.171,.618,1.66,1.794,3.271,1.137,5.237l.065-.068Z"/>
      </svg>`,
        two: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 89.027 58.273">
        <path fill="${colors.tertiary}" d="M0,25.507c9.389-3.042,17.838-5.795,26.297-8.518C42.903,11.642,59.52,6.333,76.113,.948c2.099-.681,4.169-1.173,6.356-.843,4.872,.736,7.599,4.625,6.186,9.335-4.631,15.443-9.456,30.828-14.107,46.266-.666,2.209-1.546,3.197-3.843,2.145C47.456,47.21,24.203,36.577,0,25.507Z"/>
      </svg>`,
        three: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.948 60.449">
        <path fill="${colors.quaternary}" d="M43.948,0c-2.792,18.508-5.36,35.774-8.017,53.025-1.017,6.604-8.283,9.731-13.654,5.484-7.299-5.773-14.12-12.151-21.165-18.247-2.63-2.276,.083-3.083,1.206-4.069C13.448,26.418,24.636,16.711,35.813,6.991c2.362-2.054,4.747-4.081,8.135-6.991Z"/>
      </svg>`,
        center: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.395 61.523">
        <path fill="${colors.primary}" d="M.638,0C20.933,9.256,41.326,18.557,62.395,28.166c-7.918,6.915-15.263,13.34-22.62,19.752-4.763,4.151-9.576,8.247-14.3,12.442-1.567,1.391-2.659,1.904-3.581-.581C14.615,40.17,7.295,20.577,.004,.973c-.034-.091,.168-.27,.634-.973Z"/>
      </svg>`,
      },
    };
  }
})();
