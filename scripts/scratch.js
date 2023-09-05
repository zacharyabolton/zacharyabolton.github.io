// Create new p5 instance
let s = (p) => {
  // Local variables
  let canvas;
  let nodes;
  let factor;
  let radius;
  let t;
  let x1;
  let y1;
  let x2;
  let y2;
  let current_product;
  let theme_color;
  let breath = 0;
  let inhale = true;
  let maxFN = 2048;
  let minN = 10;
  let minF = 2;
  let colorScheme;

  // Function to handle resizing the window
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    canvas.style("z-index", -1);
    radius = Math.min(p.windowHeight, p.windowWidth) / 2;
    p.background(10);
  };

  // Setup function to initialize the canvas
  p.setup = () => {
    p.pixelDensity(1);
    p.colorMode(p.HSB);
    theme_color = [p.ceil(p.random(0, 360)), 70, 50];
    colorScheme = p.random([180, 120, 90]);
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.position(0, 0);
    canvas.style("z-index", -1);
    radius = Math.min(p.windowHeight, p.windowWidth) / 2;
    t = 0;
    current_product = 0;
    p.background(10);
    nodes = p.ceil(p.random(minN - 1, maxFN + 1));
    factor = p.ceil(p.random(minF - 1, maxFN + 1));
  };

  // Draw function to render each frame
  p.draw = () => {
    p.translate(p.windowWidth / 2, p.windowHeight / 2);

    // Calculate points for the lines
    x1 = Math.sin(((2 * p.PI) / nodes) * t) * radius;
    y1 = Math.cos(((2 * p.PI) / nodes) * t) * radius;
    x2 = Math.sin(((2 * p.PI) / nodes) * current_product) * radius;
    y2 = Math.cos(((2 * p.PI) / nodes) * current_product) * radius;

    // Draw the line
    p.stroke(theme_color[0], theme_color[1], breath);
    p.strokeWeight(1);
    p.line(x1, y1, x2, y2);

    // Update the variables for next frame
    t = (t + 1) % nodes;
    current_product = (factor * t) % nodes;
    if (t == current_product) {
      p.point(x1, y1, 2, 2);
    }

    // Animate the breath (brightness)
    if (inhale) {
      breath++;
      if (breath == 256) {
        inhale = false;
      }
    } else {
      breath--;
      if (breath == 0) {
        inhale = true;
        theme_color[0] = (theme_color[0] + colorScheme) % 360;
      }
    }

    // Output nodes and factor values
    document.getElementById("nodesOutput").innerHTML = nodes;
    document.getElementById("factorOutput").innerHTML = factor;
  };
};

// Run the sketch using the instance mode
let myp5 = new p5(s);
