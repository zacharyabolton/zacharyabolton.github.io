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
var holdTime = 200;
var highlightTimeout = 200;
var currentEvent;
var isTouch = ('ontouchstart' in window);

var colorScheme = 120;


console.log(colorScheme);

// console.log(window)

// function kill(type){
//  window.addEventListener(type, function(e){
//    e.preventDefault();
//    e.stopPropagation();
//    return false;
//  }, true);
// }

// if( isTouch ){
//  kill('mousedown');
//  kill('mousemove');
// }

// window.addEventListener('touchend', handleMouseUp);
// window.addEventListener('mouseup', handleMouseUp);

// function handleMouseUp() {
//     nodeDecIsDown = false;
//     nodeIncIsDown = false;
//     factorDecIsDown = false;
//     factorIncIsDown = false;
//     long = false;

//     setTimeout(function(){
//         nodeDecUserInput.style('border-right', '2rem solid #1A1A1A');
//         nodeIncUserInput.style('border-left', '2rem solid #1A1A1A')
//         nodeUserOutput.style('color', '#1A1A1A');

//         factorDecUserInput.style('border-right', '2rem solid #1A1A1A');
//         factorIncUserInput.style('border-left', '2rem solid #1A1A1A')
//         factorUserOutput.style('color', '#1A1A1A');
//     }, highlightTimeout);
// }

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    // canvas.position(0,0);
    canvas.style('z-index', -1);
    radius = min(windowHeight, windowWidth)/2;
    // $('.container').width(windowWidth);
    // $('.container').height(windowHeight);
    // $('.container').css('text-align', 'center');
    // $('.container').css('position', 'absolute');
    // $('.container').css('top', 0);
    // $('.container').css('bottom', 0);
    // $('.container').css('left', 0);
    // $('.container').css('right', 0);
    // $('.container').css('margin', 'auto');

    
    // animationControlsContainer.position(0, 0);
    // animationControlsContainer.style('padding', '0px '+(windowWidth*0.05)+'px 0px '+(windowWidth*0.05)+'px');
    
    // animationControlsContainer.style('width', windowWidth+'px');

    // animationControlsContainer.style('height', '6.4rem');
    // animationControlsContainer.style('text-align', 'center');
    // animationControlsContainer.style('position', 'absolute');
    // animationControlsContainer.style('top', 0);
    // animationControlsContainer.style('bottom', 0);
    // animationControlsContainer.style('left', 0);
    // animationControlsContainer.style('right', 0);
    // animationControlsContainer.style('margin', 'auto');

    background(10);
};

function newAnimation(nodes, factor, ui = false)
{
    setup(nodes, factor);

    // setTimeout(function(){
    //     // newAnimationButton.remove();
    //     // animationControlsContainer.remove();
    //     canvas.remove();

    //     setup(nodes, factor);
    // }, highlightTimeout);
    
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
    // if (nodeDecIsDown && (nodes > minNodes) && long){
    //     nodeDecUserInput.style('border-right', '2rem solid white');
    //     nodeUserOutput.style('color', 'white');
    //     nodes --;
    //     nodeUserOutput.html(nodes);
    //     newAnimation(nodes, factor, true);
    // }
    // if (nodeIncIsDown && (nodes < maxNodes) && long){
    //     nodeIncUserInput.style('border-left', '2rem solid white');
    //     nodeUserOutput.style('color', 'white');
    //     nodes ++;
    //     nodeUserOutput.html(nodes);
    //     newAnimation(nodes, factor, true);
    // }
    // if (factorDecIsDown && (factor > minFactor) && long){
    //     factorDecUserInput.style('border-right', '2rem solid white');
    //     factorUserOutput.style('color', 'white');
    //     factor --;
    //     factorUserOutput.html(factor);
    //     newAnimation(nodes, factor, true);
    // }
    // if (factorIncIsDown && (factor < maxNodes) && long){
    //     factorIncUserInput.style('border-left', '2rem solid white');
    //     factorUserOutput.style('color', 'white');
    //     factor ++;
    //     factorUserOutput.html(factor);
    //     newAnimation(nodes, factor, true);
    // }

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
    // newAnimationButton = createButton('New Animation').addClass('new-animation-button');
    // newAnimationButton.mousePressed(newAnimation);
    if (!udnodes)
    {
        nodes = ceil(random(minNodes, maxNodes));
    }
    var maxFactor = nodes/maxFactorRelToNodes;
    if (!udfactor)
    {
        factor = ceil(random(minFactor, maxFactor));
    }

    // animationControlsContainer = createDiv().addClass('animation-controls-container');

    // nodeControlsContainer = createDiv().addClass('node-controls-container');
    // nodeControlsContainer.parent(animationControlsContainer);

    // factorControlsContainer = createDiv().addClass('factor-contols-container');
    // factorControlsContainer.parent(animationControlsContainer);

    // =================================
    // ========= NODE CONTROLS =========
    // =================================
    // nodeDecUserInput = createDiv().addClass('input decrement node-controls');
    // nodeDecUserInput.parent(nodeControlsContainer);

    // nodeUserOutput = createDiv(nodes).addClass('output node-controls');
    // nodeUserOutput.parent(nodeControlsContainer);

    // nodeIncUserInput = createDiv().addClass('input increment node-controls');
    // nodeIncUserInput.parent(nodeControlsContainer);

    // nodeDecUserInput.mousePressed(function(e){
    //     if ((nodes > minNodes) && !long){
    //         currentEvent = e;
    //         nodeDecUserInput.style('border-right', '2rem solid white');
    //         nodeUserOutput.style('color', 'white');
    //         nodeDecIsDown = true;
    //         nodes --;
    //         nodeUserOutput.html(nodes);
    //         newAnimation(nodes, factor, true);
    //         setTimeout(function(){
    //             if (nodeDecIsDown)
    //             {
    //                 long = true;
    //             }
    //             else
    //             {
    //                 long = false;
    //             }
                
    //         }, holdTime);
    //     }
    // });
    // nodeIncUserInput.mousePressed(function(e, d){
    //     console.log(e.target);
    //     if ((nodes < maxNodes) && !long){
    //         currentEvent = e;
    //         nodeIncUserInput.style('border-left', '2rem solid white');
    //         nodeUserOutput.style('color', 'white');
    //         nodeIncIsDown = true;
    //         nodes ++;
    //         nodeUserOutput.html(nodes);
    //         newAnimation(nodes, factor, true);
    //         setTimeout(function(){
    //             if (nodeIncIsDown)
    //             {
    //                 long = true;
    //             }
    //             else
    //             {
    //                 long = false;
    //             }
                
    //         }, holdTime);
    //     }
    // });

    // // =================================
    // // ======== FACTOR CONTROLS ========
    // // =================================
    // // factorDecUserInput = createDiv().addClass('input decrement factor-controls');
    // // factorDecUserInput.parent(factorControlsContainer);

    // // factorUserOutput = createDiv(factor).addClass('output factor-controls');
    // // factorUserOutput.parent(factorControlsContainer);

    // // factorIncUserInput = createDiv().addClass('input increment factor-controls');
    // // factorIncUserInput.parent(factorControlsContainer);

    // factorDecUserInput.mousePressed(function(e){
    //     if ((factor > minFactor) && !long){
    //         currentEvent = e;
    //         factorDecUserInput.style('border-right', '2rem solid white');
    //         factorUserOutput.style('color', 'white');
    //         factorDecIsDown = true;
    //         factor --;
    //         factorUserOutput.html(factor);
    //         newAnimation(nodes, factor, true);
    //         setTimeout(function(){
    //             if (factorDecIsDown)
    //             {
    //                 long = true;
    //             }
    //             else
    //             {
    //                 long = false;
    //             }
                
    //         }, holdTime);
    //     }
        
    // });
    // factorIncUserInput.mousePressed(function(e){
    //     if ((factor < maxNodes) && !long){
    //         currentEvent = e;
    //         factorIncUserInput.style('border-left', '2rem solid white');
    //         factorUserOutput.style('color', 'white');
    //         factorIncIsDown = true;
    //         factor ++;
    //         factorUserOutput.html(factor);
    //         newAnimation(nodes, factor, true);
    //         setTimeout(function(){
    //             if (factorIncIsDown)
    //             {
    //                 long = true;
    //             }
    //             else
    //             {
    //                 long = false;
    //             }
    //         }, holdTime);
    //     }
    // });
};
