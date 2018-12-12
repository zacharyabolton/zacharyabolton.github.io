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
var myFont;
var maxNodes = 4000;
var minNodes = 9;
var minFactor = 2;
var maxFactorRelToNodes = 3;
var nodeSlider;
var nodeDisplay;
var nodeSpan;
var factorSlider;
var factorDisplay;
var factorSpan;
var animationControlsContainer;

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    radius = min(windowHeight, windowWidth)/2;
    animationControlsContainer.position(0, (windowHeight/2) - 60);
    background(10);

};

function setup(nodes, factor) {
    pixelDensity(1);
    colorMode(HSB);

    theme_color = [random(0,361),70,50];

    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
    canvas.style('z-index', -1);

    radius = min(windowHeight, windowWidth)/2;

    t = 0;
    current_product = 0;

    background(10);

    animationControls();
};

function newAnimation(n_inp, f_inp)
{
    animationControlsContainer.remove();
    canvas.remove();

    setup(n_inp, f_inp);
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
};

function animationControls()
{
    animationControlsContainer = createDiv();
    animationControlsContainer.position(0, (windowHeight/2) - 60);
    animationControlsContainer.style('padding', '0% 5% 0% 5%');
    animationControlsContainer.style('width', '90%');
    animationControlsContainer.style('text-align', 'center');
    animationControlsContainer.style('font-family', 'helvetica');
    animationControlsContainer.style('font-size', '1rem');
    animationControlsContainer.style('text-shadow', '-1px 0 rgb(80, 80, 80), 0 1px rgb(80, 80, 80), 1px 0 rgb(80, 80, 80), 0 -1px rgb(80, 80, 80)');

    nodes = ceil(random(minNodes, maxNodes));
    var maxFactor = nodes/maxFactorRelToNodes;
    factor = ceil(random(minFactor, maxFactor));

    nodeSlider = createSlider(minNodes, maxNodes, nodes, 1);
    nodeSlider.parent(animationControlsContainer);
    nodeSlider.style('display', 'block');
    nodeSlider.style('width', '100%');
    // nodeSlider.style('height', '30px');

    nodeDisplay = createP('Base: ');
    nodeSpan = createSpan(nodes);
    nodeSpan.style('font-size', '1.9rem');
    nodeSpan.style('font-weight', 'bold');
    nodeDisplay.parent(animationControlsContainer);
    nodeDisplay.style('margin', '0px');
    nodeSpan.parent(nodeDisplay);

    factorDisplay = createP('Factor: ');
    factorSpan = createSpan(factor);
    factorSpan.style('font-size', '1.9rem');
    factorSpan.style('font-weight', 'bold');
    factorDisplay.parent(animationControlsContainer);
    factorDisplay.style('margin', '0px');
    factorSpan.parent(factorDisplay);

    factorSlider = createSlider(minFactor, maxFactor, factor, 1);
    factorSlider.parent(animationControlsContainer);
    factorSlider.style('display', 'block');
    factorSlider.style('width', '100%');

    nodeSlider.input(function(){
        nodes = nodeSlider.value();
        nodeSpan.html(nodes);
        clear();
        background(10);
    });

    factorSlider.input(function(){
        factor = factorSlider.value();
        factorSpan.html(factor);
        clear();
        background(10);
    });
};
