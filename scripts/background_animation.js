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
var maxNodes = 4000;
var minNodes = 9;
var minFactor = 2;
var maxFactorRelToNodes = 3;

var hold = false;
var down = false;
var g_isNodes;
var g_isIncrement;

var colorScheme = 120;

window.onload = function () {

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

function newAnimation(nodes, factor, ui = false)
{
    setup(nodes, factor);
};

function setup(nodes, factor) {
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
    animationControls(nodes, factor);
};

function draw() {
    if (hold) {
        nodes = nodes + ((g_isNodes * g_isIncrement) || (g_isNodes * -1));
        factor = factor + ((((g_isNodes - 1) * -1) * g_isIncrement) || (((g_isNodes - 1) * -1) * -1));
    }

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

    $('#nodesOutput').html(nodes);
    $('#factorOutput').html(factor);
};

function animationControls(udnodes, udfactor)
{
    if (!udnodes)
    {
        nodes = ceil(random(minNodes, maxNodes));
    }
    var maxFactor = nodes/maxFactorRelToNodes;
    if (!udfactor)
    {
        factor = ceil(random(minFactor, maxFactor));
    }
};

function userInput(isNodes, isIncrement) {
    g_isNodes = isNodes;
    g_isIncrement = isIncrement;
    down = true;
    hold = false;
    // iterate once
    handleInput(isNodes, isIncrement);

    setTimeout(function(){
        hold = down ? true : false;
        // while (hold) {
        //     scanValues = [isNodes, isIncrement];
        // }
    }, 1000);
}

function handleInput(isNodes, isIncrement) {
    // update values
    nodes = nodes + ((isNodes * isIncrement) || (isNodes * -1));
    factor = factor + ((((isNodes - 1) * -1) * isIncrement) || (((isNodes - 1) * -1) * -1));
    // get hold of relevant elements
    var inEl = document.getElementById(isIncrement ? (isNodes ? 'incNodes' : 'incFactor') : (isNodes ? 'decNodes' : 'decFactor'));
    var outEl = document.getElementById(isNodes ? 'nodesOutput' : 'factorOutput');
    // make relevant elements white
    $(inEl).css(isIncrement ? 'border-left' : 'border-right', '2rem solid white');
    $(outEl).css('color', 'white');
    // reset animation with new values
    setup(nodes, factor);
}

function endUserInput(isNodes, isIncrement) {
    console.log('endUserInput says hold = '+hold);
    hold = false;
    down = false;
    // get ahold of relevant elements
    var inEl = document.getElementById(isIncrement ? (isNodes ? 'incNodes' : 'incFactor') : (isNodes ? 'decNodes' : 'decFactor'));
    var outEl = isNodes ? document.getElementById('nodesOutput') : document.getElementById('factorOutput');
    // apply fade out
    $(inEl).addClass(isIncrement ? 'incFadeout' : 'decFadeout');
    $(outEl).addClass('outputFadout');
    // create clones
    var newInEl = inEl.cloneNode(true);
    var newOutEl = outEl.cloneNode(true);
    // switch for clones
    inEl.parentNode.replaceChild(newInEl, inEl);
    outEl.parentNode.replaceChild(newOutEl, outEl);
    // style clones
    $(newInEl).css(isIncrement ? 'border-left' : 'border-right', '2rem solid #1A1A1A');
    $(newOutEl).css('color', '#1A1A1A')
}
