function generateRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function createButterfly(width, colors = null) {
  const butterfly = document.createElement("div");
  butterfly.style.position = "absolute";
  butterfly.className = "butterfly";
  butterfly.style.width = width + "px";

  // Generate random colors if not provided
  const wingColors = colors || {
    primary: generateRandomColor(),
    secondary: generateRandomColor(),
    tertiary: generateRandomColor(),
    quaternary: generateRandomColor(),
  };

  // Scale factors based on original SVG dimensions
  const gap = width / 29.75;
  const forewingWidth = (width - gap) / 2;
  const forewingHeight = width * 0.4496;
  const hindwingHeight = width * 0.4412;
  const hindwingMargin = width * 0.09234;

  // Create wings (left and right)
  ["left", "right"].forEach((side) => {
    const wing = document.createElement("div");
    wing.className = `wing ${side}`;

    const forewing = document.createElement("div");
    forewing.className = "forewing";
    forewing.style.width = forewingWidth + "px";
    forewing.style.height = forewingHeight + "px";

    const hindwing = document.createElement("div");
    hindwing.className = "hindwing";
    hindwing.style.height = hindwingHeight + "px";
    hindwing.style.marginLeft = hindwingMargin + "px";

    // Add wing sections with SVGs
    const sections = createWingSections(wingColors);
    Object.entries(sections.forewing).forEach(([key, svg]) => {
      const section = document.createElement("div");
      section.className = `section ${key}`;
      section.innerHTML = svg;
      forewing.appendChild(section);
    });

    Object.entries(sections.hindwing).forEach(([key, svg]) => {
      const section = document.createElement("div");
      section.className = `section ${key}`;
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

// Function to generate random flight path animation
function generateFlightPath(startFromClick = false) {
  // Edge positions for spawning and exit
  const edgePositions = [
    { x: -40, y: Math.random() * 140 - 20 }, // Left edge
    { x: 140, y: Math.random() * 140 - 20 }, // Right edge
    { x: Math.random() * 140 - 20, y: -40 }, // Top edge
    { x: Math.random() * 140 - 20, y: 140 }, // Bottom edge
  ];

  let startPos;
  if (startFromClick) {
    startPos = {
      x: lastClickX,
      y: lastClickY,
    };
  } else {
    // For auto-spawns, start from an edge
    startPos = edgePositions[Math.floor(Math.random() * edgePositions.length)];
  }

  // Pick a random end edge position
  const endPos =
    edgePositions[Math.floor(Math.random() * edgePositions.length)];

  // Create a smooth curve with one control point
  const controlPoint = {
    x: (startPos.x + endPos.x) / 2 + (Math.random() * 40 - 20),
    y: (startPos.y + endPos.y) / 2 + (Math.random() * 40 - 20),
  };

  const keyframes = [];
  const steps = 60; // More steps for smoother animation

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    // Quadratic Bézier curve calculation
    const x =
      Math.pow(1 - t, 2) * startPos.x +
      2 * (1 - t) * t * controlPoint.x +
      Math.pow(t, 2) * endPos.x;
    const y =
      Math.pow(1 - t, 2) * startPos.y +
      2 * (1 - t) * t * controlPoint.y +
      Math.pow(t, 2) * endPos.y;

    // Compute tangent via the derivative of the quadratic Bézier curve:
    const dx =
      2 * (1 - t) * (controlPoint.x - startPos.x) +
      2 * t * (endPos.x - controlPoint.x);
    const dy =
      2 * (1 - t) * (controlPoint.y - startPos.y) +
      2 * t * (endPos.y - controlPoint.y);
    const rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    // Apply gentle flutter effect
    keyframes.push({
      transform: `translate(${x}vw, ${y}vh) ${startFromClick ? "translate(-50%, -50%) " : ""}rotate(${rotation + Math.sin(t * Math.PI * 2) * 10}deg)`,
    });
  }

  return keyframes;
}

// Function to add a new butterfly to the scene
function addButterfly(isClickSpawn = false) {
  const scene = document.querySelector(".scene");

  // Calculate depth factor (0-1, where 1 is closest)
  const depthFactor = Math.random();

  // Size based on depth (100-300px for closest, 50-150px for furthest)
  const minSize = 50 + depthFactor * 50;
  const maxSize = 150 + depthFactor * 150;
  const width = minSize + Math.random() * (maxSize - minSize);

  const butterfly = createButterfly(width);

  // Set z-index based on depth (0-999)
  const zIndex = Math.floor(depthFactor * 1000);
  butterfly.style.zIndex = zIndex;

  // Apply depth effects
  butterfly.style.opacity = 0.5 + depthFactor * 0.5; // More transparent when further
  butterfly.style.filter = `blur(${(1 - depthFactor) * 1}px)`; // Slightly blurrier when further

  // Create and apply random flight animation
  const animation = butterfly.animate(generateFlightPath(isClickSpawn), {
    duration: Math.random() * 10000 + 15000, // Random duration between 15-25s
    iterations: 1, // Only play once
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  });

  // Remove butterfly when animation completes
  animation.onfinish = () => {
    butterfly.remove();
  };

  scene.appendChild(butterfly);
}

// Track last click position
let lastClickX = 0;
let lastClickY = 0;

// Initialize scene with random butterflies and maintain population
document.addEventListener("DOMContentLoaded", () => {
  const scene = document.createElement("div");
  scene.className = "scene";
  document.body.appendChild(scene);

  // Add initial butterflies
  for (let i = 0; i < 5; i++) {
    addButterfly(false);
  }

  // Track click position and add butterfly
  document.addEventListener("click", (e) => {
    // Convert click position to viewport percentage
    lastClickX = (e.clientX / window.innerWidth) * 100;
    lastClickY = (e.clientY / window.innerHeight) * 100;
    addButterfly(true);
  });

  // Periodically check and maintain butterfly population
  setInterval(() => {
    const currentCount = document.querySelectorAll(".butterfly").length;
    if (currentCount < 5) {
      addButterfly(false);
    }
  }, 5000); // Check every 5 seconds
});
