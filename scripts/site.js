/* A quieter version of the site's original modular-multiplication artwork. */
(() => {
  const canvas = document.querySelector("#math-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  document.querySelector(".math-controls").hidden = false;
  const pause = document.querySelector("#math-pause");
  const shuffle = document.querySelector("#math-shuffle");
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = media.matches,
    visible = true,
    frame = 0,
    last = 0,
    time = 0;
  let nodes = 480,
    factor = 151,
    hue = 83,
    width = 0,
    height = 0;
  let drawing = new window.MultiplicationDrawing(nodes, factor);

  function paint(stamp = performance.now()) {
    ctx.clearRect(0, 0, width, height);
    const radius = Math.min(width, height) * 0.47;
    const cx = width * 0.51,
      cy = height * 0.48;
    const pulse = Math.sin(time * 0.0003);
    const amount = drawing.amount(stamp);
    ctx.lineWidth = 0.65;
    for (let index = 0; index < Math.ceil(amount); index++) {
      const { i, a, x1, y1, x2, y2 } = drawing.connections[index];
      const part = Math.min(1, amount - index);
      const bright =
        0.09 + 0.35 * Math.pow((Math.cos(a - pulse * Math.PI) + 1) / 2, 3);
      ctx.strokeStyle = `hsla(${hue + (i / nodes) * 70},65%,65%,${bright})`;
      ctx.beginPath();
      ctx.moveTo(cx + x1 * radius, cy + y1 * radius);
      ctx.lineTo(
        cx + (x1 + (x2 - x1) * part) * radius,
        cy + (y1 + (y2 - y1) * part) * radius,
      );
      ctx.stroke();
    }
  }
  function tick(stamp) {
    frame = 0;
    if (!visible || document.hidden) return;
    // Reveal at display refresh rate; ambient motion can run more quietly.
    if (
      drawing.active(last) ||
      drawing.active(stamp) ||
      paused ||
      stamp - last >= 50
    ) {
      if (!paused) time += Math.min(stamp - last, 100);
      last = stamp;
      paint(stamp);
    }
    if (!paused || drawing.active(stamp)) frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    pause.textContent = paused ? "Play motion" : "Pause motion";
    pause.setAttribute("aria-pressed", String(paused));
    if (visible && !document.hidden) {
      paint();
      last = performance.now();
      if (!paused || drawing.active(last)) frame = requestAnimationFrame(tick);
    }
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint();
  }
  pause.addEventListener("click", () => {
    paused = !paused;
    sync();
  });
  shuffle.addEventListener("click", () => {
    factor = 2 + Math.floor(Math.random() * 250);
    hue = [83, 155, 265, 325][Math.floor(Math.random() * 4)];
    drawing = new window.MultiplicationDrawing(nodes, factor);
    drawing.start(performance.now(), !media.matches);
    sync();
  });
  media.addEventListener("change", () => {
    paused = media.matches;
    if (media.matches) drawing.start(performance.now(), false);
    sync();
  });
  document.addEventListener("visibilitychange", sync);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    sync();
  }).observe(canvas);
  resize();
  sync();
})();
