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
var animationControlsContainer;
var nodeControlsContainer;
var factorControlsContainer;
var nodeIncUserInput;
var nodeDecUserInput;
var nodeUserOutput;
var factorIncUserInput;
var factorDeccUserInput;
var factorUserOutput;
var newAnimationButton;
var nodeDecIsDown = false;
var nodeIncIsDown = false;
var factorDecIsDown = false;
var factorIncIsDown = false;
var long = false;

window.addEventListener('mouseup', handleMouseUp);

function handleMouseUp() {
    nodeDecIsDown = false;
    nodeIncIsDown = false;
    factorDecIsDown = false;
    factorIncIsDown = false;
    long = false;

    console.log('mouse is up');
    setTimeout(function(){
        nodeDecUserInput.style('border-right', '2rem solid #1A1A1A');
        nodeIncUserInput.style('border-left', '2rem solid #1A1A1A')
        nodeUserOutput.style('color', '#1A1A1A');

        factorDecUserInput.style('border-right', '2rem solid #1A1A1A');
        factorIncUserInput.style('border-left', '2rem solid #1A1A1A')
        factorUserOutput.style('color', '#1A1A1A');
    }, 100);
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    radius = min(windowHeight, windowWidth)/2;
    // animationControlsContainer.position(0, (windowHeight/2) - 90);
    // animationControlsContainer.style('padding', '0px '+(windowWidth*0.05)+'px 0px '+(windowWidth*0.05)+'px');
    // animationControlsContainer.style('width', (windowWidth*0.9)+'px');
    background(10);
};

function setup() {
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

function newAnimation()
{
    newAnimationButton.remove();
    animationControlsContainer.remove();
    canvas.remove();

    setup();
};

function draw() {
    if (nodeDecIsDown && (nodes > minNodes) && long){
        nodeDecUserInput.style('border-right', '2rem solid white');
        nodeUserOutput.style('color', 'white');
        nodes --;
        nodeUserOutput.html(nodes);
        clear();
        background(10);   
    }
    if (nodeIncIsDown && (nodes < maxNodes) && long){
        nodeIncUserInput.style('border-left', '2rem solid white');
        nodeUserOutput.style('color', 'white');
        nodes ++;
        nodeUserOutput.html(nodes);
        clear();
        background(10);   
    }
    if (factorDecIsDown && (factor > minFactor) && long){
        factorDecUserInput.style('border-right', '2rem solid white');
        factorUserOutput.style('color', 'white');
        factor --;
        factorUserOutput.html(factor);
        clear();
        background(10);
    }
    if (factorIncIsDown && (factor < maxNodes) && long){
        factorIncUserInput.style('border-left', '2rem solid white');
        factorUserOutput.style('color', 'white');
        factor ++;
        factorUserOutput.html(factor);
        clear();
        background(10);
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
            theme_color[0] -= 120;
        }
    }
    else
    {
        breath --;
        if (breath == 0)
        {
            inhale = true;
            theme_color[0] += 120;
        }
    }
};

function animationControls()
{
    newAnimationButton = createButton('New Animation').addClass('new-animation-button');
    newAnimationButton.mousePressed(newAnimation);

    nodes = ceil(random(minNodes, maxNodes));
    var maxFactor = nodes/maxFactorRelToNodes;
    factor = ceil(random(minFactor, maxFactor));

    animationControlsContainer = createDiv().addClass('animation-controls-container');

    nodeControlsContainer = createDiv().addClass('node-controls-container');
    nodeControlsContainer.parent(animationControlsContainer);

    factorControlsContainer = createDiv().addClass('factor-contols-container');
    factorControlsContainer.parent(animationControlsContainer);

    // =================================
    // ========= NODE CONTROLS =========
    // =================================
    nodeDecUserInput = createDiv().addClass('input decrement node-controls');
    nodeDecUserInput.parent(nodeControlsContainer);

    nodeUserOutput = createDiv(nodes).addClass('output node-controls');
    nodeUserOutput.parent(nodeControlsContainer);

    nodeIncUserInput = createDiv().addClass('input increment node-controls');
    nodeIncUserInput.parent(nodeControlsContainer);

    nodeDecUserInput.mousePressed(function(){
        if (nodes > minNodes){
            nodeDecUserInput.style('border-right', '2rem solid white');
            nodeUserOutput.style('color', 'white');
            nodeDecIsDown = true;
            nodes --;
            nodeUserOutput.html(nodes);
            clear();
            background(10);
            setTimeout(function(){
                if (nodeDecIsDown)
                {
                    long = true;
                }
                else
                {
                    long = false;
                }
                
            }, 600);
        }
    });
    nodeIncUserInput.mousePressed(function(){
        if (nodes < maxNodes){
            nodeIncUserInput.style('border-left', '2rem solid white');
            nodeUserOutput.style('color', 'white');
            nodeIncIsDown = true;
            nodes ++;
            nodeUserOutput.html(nodes);
            clear();
            background(10);
            setTimeout(function(){
                if (nodeIncIsDown)
                {
                    long = true;
                }
                else
                {
                    long = false;
                }
                
            }, 600);
        }
    });

    // =================================
    // ======== FACTOR CONTROLS ========
    // =================================
    factorDecUserInput = createDiv().addClass('input decrement factor-controls');
    factorDecUserInput.parent(factorControlsContainer);

    factorUserOutput = createDiv(factor).addClass('output factor-controls');
    factorUserOutput.parent(factorControlsContainer);

    factorIncUserInput = createDiv().addClass('input increment factor-controls');
    factorIncUserInput.parent(factorControlsContainer);

    factorDecUserInput.mousePressed(function(){
        if (factor > minFactor){
            factorDecUserInput.style('border-right', '2rem solid white');
            factorUserOutput.style('color', 'white');
            factorDecIsDown = true;
            factor --;
            factorUserOutput.html(factor);
            clear();
            background(10);
            setTimeout(function(){
                if (factorDecIsDown)
                {
                    long = true;
                }
                else
                {
                    long = false;
                }
                
            }, 600);
        }
    });
    factorIncUserInput.mousePressed(function(){
        if (factor < maxNodes){
            factorIncUserInput.style('border-left', '2rem solid white');
            factorUserOutput.style('color', 'white');
            factorIncIsDown = true;
            factor ++;
            factorUserOutput.html(factor);
            clear();
            background(10);
            setTimeout(function(){
                if (factorIncIsDown)
                {
                    long = true;
                }
                else
                {
                    long = false;
                }
                
            }, 600);
        }
    });

};






// function handleMouseDown() {
//     console.log('Mouse down...');
//   // this.innerHTML = "Mouse down...";
//   isDown = true;                                    // button status (any button here)
//   isLong = false;                                   // longpress status reset
//   target = this;                                    // store this as target element
//   clearTimeout(longTID);                            // clear any running timers
//   longTID = setTimeout(longPress.bind(this), 1500); // create a new timer for this click
// };

// function handleMouseUp(e) {
//   if (isDown && isLong) {                           // if a long press, cancel
//     isDown = false;                                 // clear in any case
//     e.preventDefault();                             // and ignore this event
//     return
//   }
  
//   if (isDown) {                                     // if we came from down status:
//       clearTimeout(longTID);                        // clear timer to avoid false longpress
//       isDown = false;
//       // target.innerHTML = "Normal up";               // for clicked element
//       console.log('Normal up');
//       target = null;
//   }
// };

// function longPress() {
//   isLong = true;
//   // this.innerHTML = "Long press";
//   console.log('Long press');
//   // throw custom event or call code for long press
// }
