

var canvas;
var t=0;
var theme_color = [255,255,233];

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}

function setup()
{
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
    canvas.style('z-index', -1);
    background(theme_color[0], theme_color[1], theme_color[2]);
    
}

function draw()
{
    stroke(theme_color[0], t%256, theme_color[2], t%256);
    
    translate(windowWidth/2,windowHeight/2);
    line(
        sin(2.39996322972865332 * t) * max([windowWidth, windowHeight]),
        cos(2.39996322972865332 * t++) * max([windowWidth, windowHeight]),
        0,
        0
        );
}

function mouseMoved()
{
    ellipse(mouseX, mouseY, 20, 20);
}
