/* Shared geometry and elapsed-time reveal for both multiplication canvases. */
window.MultiplicationDrawing = class {
  static duration = 750;

  constructor(nodes, factor) {
    this.connections = [];
    this.started = null;
    const seen = new Set();
    for (let i = 0; i < nodes; i++) {
      const target = (i * factor) % nodes;
      if (i === target) continue;
      const key = `${Math.min(i, target)}:${Math.max(i, target)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const a = (i / nodes) * Math.PI * 2;
      const b = (target / nodes) * Math.PI * 2;
      this.connections.push({
        i,
        a,
        x1: Math.sin(a),
        y1: Math.cos(a),
        x2: Math.sin(b),
        y2: Math.cos(b),
      });
    }
  }

  start(now, animate) {
    this.started = animate ? now : null;
  }

  amount(now) {
    const progress =
      this.started === null
        ? 1
        : Math.max(
            0,
            Math.min(
              1,
              (now - this.started) / window.MultiplicationDrawing.duration,
            ),
          );
    return progress * this.connections.length;
  }

  active(now) {
    return this.amount(now) < this.connections.length;
  }
};
