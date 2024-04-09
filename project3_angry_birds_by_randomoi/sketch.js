// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

var canvasWidth = 1000;
var canvasHeight = 600;
var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var propeller;
var boxes = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird = {},
    slingshotConstraint = {};
var angle = 0;
var angleSpeed = 0;
var canvas;

// Step 8
var timer = 60; // length of the game in seconds

// time function used to clear 
var tm = setInterval(function() {
    timer--; // decrements time in seconds
}, 1000);

////////////////////////////////////////////////////////////
function setup() {
    canvas = createCanvas(canvasWidth, canvasHeight);

    engine = Engine.create(); // create an engine

    setupGround();

    setupPropeller();

    setupTower();

    setupSlingshot();

    setupMouseInteraction();


}
////////////////////////////////////////////////////////////
function draw() {
    background(0);

    Engine.update(engine);

    drawGround();

    drawPropeller();

    drawTower();

    drawBirds();

    drawSlingshot();

    gameTimer();
}
////////////////////////////////////////////////////////////
/* 
STEP 8
sets up timer
*/
function gameTimer() {
    // styles the timer
    textSize(20);
    fill('#ffffff');
    textAlign(LEFT);
    text('Timer:', 25, 40);
    textAlign(LEFT);
    text(timer, 90, 40);

    // if 1 or more boxes remain on screen when the timer reaches zero "Game Over" message will display
    if (timer == 0 && boxes.length >= 1) {
        textAlign(CENTER);
        text("GAME OVER", width / 2, height / 2);
        clearInterval(tm);
    }

    // if all boxes are off screen when the timer reaches zero, "You Win" message will display
    if (timer == 0 && boxes.length == 0) {
        textAlign(CENTER);
        text("YOU WIN", width / 2, height / 2);
        clearInterval(tm);
    }
}
////////////////////////////////////////////////////////////
// use arrow keys to control propeller
function keyPressed() {
    if (keyCode == LEFT_ARROW) {
        // STEP 2b:
        // when the left arrow is pressed, the angle speed is incremented by 0.01
        setupPropeller(propeller);
        angleSpeed += 0.01;
    } else if (keyCode == RIGHT_ARROW) {
        // STEP 2b:
        // when the right arrow is pressed, the angle speed is decremented by 0.01
        setupPropeller(propeller);
        angleSpeed -= 0.01;
    }
}
////////////////////////////////////////////////////////////
function keyTyped() {
    //if 'b' create a new bird to use with propeller
    if (key === 'b') {
        setupBird();
    }

    //if 'r' reset the slingshot
    if (key === 'r') {
        removeFromWorld(slingshotBird);
        removeFromWorld(slingshotConstraint);
        setupSlingshot();
    }
}


//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

// if mouse is released destroy slingshot constraint so that
// slingshot bird can fly off
function mouseReleased() {
    setTimeout(() => {
        slingshotConstraint.bodyB = null;
        slingshotConstraint.pointA = { x: 0, y: 0 };
    }, 100);
}
////////////////////////////////////////////////////////////
// tells you if a body is off-screen
function isOffScreen(body) {
    var pos = body.position;
    return (pos.y > height || pos.x < 0 || pos.x > width);
}
////////////////////////////////////////////////////////////
// removes a body from the physics world
function removeFromWorld(body) {
    World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices, r = 255, g = 255, b = 255) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        fill(r, g, b);
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
    push();
    var offsetA = constraint.pointA;
    var posA = { x: 0, y: 0 };
    if (constraint.bodyA) {
        posA = constraint.bodyA.position;
    }
    var offsetB = constraint.pointB;
    var posB = { x: 0, y: 0 };
    if (constraint.bodyB) {
        posB = constraint.bodyB.position;
    }
    strokeWeight(5);
    stroke(255);
    line(
        posA.x + offsetA.x,
        posA.y + offsetA.y,
        posB.x + offsetB.x,
        posB.y + offsetB.y
    );
    pop();
}