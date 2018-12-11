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
let monoFont;

function preload() {
  monoFont = loadFont('Impact.ttf');
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    radius = min(windowHeight, windowWidth)/2;
    background(10);
}

function setup() {
    colorMode(HSB);
    theme_color = [random(0,361),70,50];

    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
    canvas.style('z-index', -1);

    nodes = ceil(random(9, 4000));
    factor = ceil(random(1, nodes/3));

    radius = min(windowHeight, windowWidth)/2;

    t = 0;
    current_product = 0;

    background(10);
}

function draw() {
    translate(windowWidth/2, windowHeight/2);

    x1 = sin(((2*PI)/nodes) * t) * radius;
    y1 = cos(((2*PI)/nodes) * t) * radius;

    x2 = sin(((2*PI)/nodes) * current_product) * radius;
    y2 = cos(((2*PI)/nodes) * current_product) * radius;

    stroke(theme_color[0], theme_color[1], breath);
    strokeWeight(1);
    line(x1,y1,x2,y2);

    t = (t + 1) % nodes;
    current_product = (factor * t) % (nodes);

    if (inhale)
    {
        breath ++;
        if (breath == 256)
        {
            inhale = false;
            theme_color[0] -= 30;
        }
    }
    else
    {
        breath --;
        if (breath == 0)
        {
            inhale = true;
            theme_color[0] += 60;
        }
    }

    stroke(10);
    textSize((radius*2)/5);
    textAlign(CENTER);
    textFont(monoFont);
    text('Jiggy Shmo', 10, 60);
    fill(10);
}
