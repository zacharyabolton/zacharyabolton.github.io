// --- Reintroduce DOM Elements (menu/modal) ---
window.onload = function () {
  var body = document.getElementById("nojsHandle");
  if (body) body.className = "yesjs";

  var modal = document.getElementById("animation-explanation-modal");
  var btn = document.getElementById("info-button");
  var span = document.getElementsByClassName("close")[0];

  if (btn) {
    btn.onclick = function () {
      if (modal) modal.style.display = "block";
    };
  }
  if (span) {
    span.onclick = function () {
      if (modal) modal.style.display = "none";
    };
  }
  window.onclick = function (event) {
    if (modal && event.target === modal) {
      modal.style.display = "none";
    }
  };
};

// --- p5.js Sketch Variables ---
var canvas, nodes, factor, radius;
var palette = [];
var drawing;
var motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
var motionPaused = motionPreference.matches;
var pulseFrame = 0;

function updateMotion() {
  const button = document.getElementById("playground-motion");
  if (button) {
    button.textContent = motionPaused ? "Play motion" : "Pause motion";
    button.setAttribute("aria-pressed", String(motionPaused));
  }
  if (document.hidden || (motionPaused && !drawing.active(performance.now())))
    noLoop();
  else loop();
}

// Expanded range for more variety:
var minNodes = 100;
var maxNodes = 4096;
var minF = 2;
var maxF = 1024;

// Parameters for the coordinated pulse effect:
var pulseSpeed = 0.005; // Controls pulse speed
var pulseThresholdFactor = 0.5; // Fraction of radius used for pulse threshold
var peakB = 255; // Max brightness for the pulse
var huePulseShift = 20; // Max hue shift from the pulse

// New parameter: Multiply the base brightness when pulse effect is low
var contrastFactor = 0.1; // Lower than 1 makes the darks darker

// A global hue offset that slowly cycles over time
var globalHueCycle = 0;

// --- Setup & Initial Randomization ---
function setup() {
  // This is flat geometry: Canvas 2D avoids thousands of WebGL draw calls.
  pixelDensity(Math.min(displayDensity(), 2));
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  canvas.position(0, 0);
  canvas.style("z-index", "-1");

  radius = min(windowHeight, windowWidth) / 2;
  smooth();
  background(10);

  reinitialize(false);
  const motionButton = document.getElementById("playground-motion");
  motionButton.addEventListener("click", () => {
    motionPaused = !motionPaused;
    updateMotion();
  });
  motionPreference.addEventListener("change", () => {
    motionPaused = motionPreference.matches;
    if (motionPreference.matches) drawing.start(performance.now(), false);
    redraw();
    updateMotion();
  });
  document.addEventListener("visibilitychange", () => {
    redraw();
    updateMotion();
  });
  updateMotion();
}

// --- Reinitialize Function ---
function reinitialize(animate = true) {
  nodes = ceil(random(minNodes, maxNodes));
  factor = ceil(random(minF, maxF));
  drawing = new window.MultiplicationDrawing(nodes, factor);
  drawing.start(performance.now(), animate && !motionPreference.matches);

  // For a focused look, choose 1 or 2 colors.
  palette = [];
  var numColors = random() < 0.5 ? 1 : 2;
  for (let i = 0; i < numColors; i++) {
    let hueVal = random(0, 360);
    let satVal = random(50, 70);
    let briVal = random(50, 70);
    palette.push({ hue: hueVal, sat: satVal, bri: briVal });
  }
  document.getElementById("nodesOutput").textContent = nodes;
  document.getElementById("factorOutput").textContent = factor;
  redraw();
  updateMotion();
}

// Ease‑in‑out using cosine
function easeInOut(t) {
  return (1 - cos(PI * t)) / 2;
}

function draw() {
  background(10);

  push();
  translate(windowWidth / 2, windowHeight / 2);

  // --- Global Pulse (dynamic movement) ---
  if (!motionPaused) pulseFrame++;
  let rawT = (pulseFrame * pulseSpeed) % 2;
  let tVal = rawT < 1 ? rawT : 2 - rawT;
  let easeT = easeInOut(tVal);
  let globalPulseX = lerp(radius, -radius, easeT);

  // --- Update the slow global hue cycle ---
  globalHueCycle = (pulseFrame * 0.1) % 360;

  // --- Adjust Segments for Performance ---
  let segCount;
  if (nodes <= 512) {
    segCount = 3;
  } else if (nodes <= 2048) {
    segCount = 2;
  } else {
    segCount = 1;
  }

  // --- Compute Effective Pulse Threshold relative to radius ---
  let effectivePulseThreshold = radius * pulseThresholdFactor;
  let sigma = effectivePulseThreshold / 2;

  // --- Draw Multiplication Table Connections ---
  const stamp = performance.now();
  const amount = drawing.amount(stamp);
  for (let index = 0; index < Math.ceil(amount); index++) {
    const connection = drawing.connections[index];
    const i = connection.i;
    const part = Math.min(1, amount - index);
    const x1 = connection.x1 * radius,
      y1 = connection.y1 * radius;
    const x2 = connection.x2 * radius,
      y2 = connection.y2 * radius;

    // Pick from our 1–2 color palette
    let baseColor = palette[i % palette.length];

    // Subdivide each connection
    for (let j = 0; j < segCount; j++) {
      let t1 = j / segCount;
      if (t1 >= part) break;
      let t2 = Math.min((j + 1) / segCount, part);
      let segX1 = lerp(x1, x2, t1);
      let segY1 = lerp(y1, y2, t1);
      let segX2 = lerp(x1, x2, t2);
      let segY2 = lerp(y1, y2, t2);

      // Distance from the pulse center
      let midX = (segX1 + segX2) / 2;
      let d = abs(midX - globalPulseX);
      let pulseFactor = exp(-(d * d) / (2 * sigma * sigma));

      // Horizontal "contour" shift based on segment's x-position
      let globalHueShift = map(midX, -radius, radius, -30, 30);

      // Combine:
      //   1) Base color
      //   2) Global hue cycle (time-based shift)
      //   3) Local pulse-based hue shift
      //   4) Contour shift (based on x-position)
      let finalHue =
        (baseColor.hue +
          globalHueCycle +
          pulseFactor * huePulseShift +
          globalHueShift) %
        360;
      let finalSat = baseColor.sat;
      // Increase contrast: use baseColor.bri * contrastFactor for low pulseFactor values.
      let finalBri = lerp(baseColor.bri * contrastFactor, peakB, pulseFactor);

      stroke(finalHue, finalSat, finalBri);
      strokeWeight(1);
      line(segX1, segY1, segX2, segY2);
    }
  }

  pop();

  if (motionPaused && !drawing.active(stamp)) noLoop();
}

// Reinitialize on 'r' key
function keyPressed() {
  if (key === "r" || key === "R") {
    reinitialize();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  canvas.style("z-index", "-1");
  radius = min(windowHeight, windowWidth) / 2;
  background(10);
}
