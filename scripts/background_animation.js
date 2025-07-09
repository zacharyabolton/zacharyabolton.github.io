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
var isFirefox = false;

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
  // Detect Firefox
  isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  
  pixelDensity(displayDensity());
  colorMode(HSB);
  
  // Use 2D renderer for Firefox, WEBGL for others
  if (isFirefox) {
    canvas = createCanvas(windowWidth, windowHeight);
  } else {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  }
  
  canvas.position(0, 0);
  canvas.style("z-index", "-1");

  radius = min(windowHeight, windowWidth) / 2;
  smooth();
  background(10);

  reinitialize(); // set nodes, factor, palette initially
}

// --- Reinitialize Function ---
function reinitialize() {
  nodes = ceil(random(minNodes, maxNodes));
  factor = ceil(random(minF, maxF));

  // For a focused look, choose 1 or 2 colors.
  palette = [];
  var numColors = random() < 0.5 ? 1 : 2;
  for (let i = 0; i < numColors; i++) {
    let hueVal = random(0, 360);
    let satVal = random(50, 70);
    let briVal = random(50, 70);
    palette.push({ hue: hueVal, sat: satVal, bri: briVal });
  }
}

// Ease‑in‑out using cosine
function easeInOut(t) {
  return (1 - cos(PI * t)) / 2;
}

function draw() {
  background(10);

  // Handle coordinate system differences between WEBGL and 2D renderers
  if (isFirefox) {
    // 2D renderer - translate to center
    push();
    translate(windowWidth / 2, windowHeight / 2);
  } else {
    // WEBGL renderer - center coordinate system
    translate(-windowWidth / 2, -windowHeight / 2);
    translate(windowWidth / 2, windowHeight / 2);
  }

  // --- Global Pulse (dynamic movement) ---
  let rawT = (frameCount * pulseSpeed) % 2;
  let tVal = rawT < 1 ? rawT : 2 - rawT;
  let easeT = easeInOut(tVal);
  let globalPulseX = lerp(radius, -radius, easeT);

  // --- Update the slow global hue cycle ---
  globalHueCycle = (frameCount * 0.1) % 360;

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
  for (let i = 0; i < nodes; i++) {
    let angle1 = (TWO_PI / nodes) * i;
    let angle2 = (TWO_PI / nodes) * ((i * factor) % nodes);
    let x1 = sin(angle1) * radius;
    let y1 = cos(angle1) * radius;
    let x2 = sin(angle2) * radius;
    let y2 = cos(angle2) * radius;

    // Pick from our 1–2 color palette
    let baseColor = palette[i % palette.length];

    // Subdivide each connection
    for (let j = 0; j < segCount; j++) {
      let t1 = j / segCount;
      let t2 = (j + 1) / segCount;
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

  // Restore transformation matrix for Firefox
  if (isFirefox) {
    pop();
  }

  // --- Update On-Screen Displays ---
  document.getElementById("nodesOutput").innerHTML = nodes;
  document.getElementById("factorOutput").innerHTML = factor;
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
  
  // Ensure proper rendering mode is maintained on resize
  if (isFirefox && canvas._renderer.drawingContext.constructor.name === "WebGLRenderingContext") {
    // If somehow we ended up with WebGL in Firefox, recreate as 2D
    canvas.remove();
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style("z-index", "-1");
  }
}
