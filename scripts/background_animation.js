var canvas;
var nodes;
var factor;
var radius;
var t;
var x1;
var y1;
var x2;
var y2;
var current_product;
var theme_color;
var breath = 0;
var inhale = true;
var maxFN = 2048;
var minN = 10;
var minF = 2;
var colorScheme;

window.onload = function () {
    var body = document.getElementById("nojsHandle");
    body.className = body.className = "yesjs";

    var modal = document.getElementById('animation-explanation-modal');
    var btn = document.getElementById('info-button');
    var span = document.getElementsByClassName('close')[0];

    btn.onclick = function() {
        modal.style.display = 'block';
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
};

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    canvas.style('z-index', -1);
    radius = min(windowHeight, windowWidth)/2;
    background(10);
};

function setup() {
    pixelDensity(1);
    colorMode(HSB);
    theme_color = [ceil(random(0,360)),70,50];
    colorScheme = random([180, 120, 90]);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
    canvas.style('z-index', -1);
    radius = min(windowHeight, windowWidth)/2;
    t = 0;
    current_product = 0;
    background(10);
    nodes = ceil(random(minN - 1, maxFN + 1));
    factor = ceil(random(minF - 1, maxFN + 1));
};

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
        }
    }
    else
    {
        breath --;
        if (breath == 0)
        {
            inhale = true;
            theme_color[0] = (theme_color[0] + colorScheme) % 360;
        }
    }

    document.getElementById('nodesOutput').innerHTML = nodes;
    document.getElementById('factorOutput').innerHTML = factor;
};
