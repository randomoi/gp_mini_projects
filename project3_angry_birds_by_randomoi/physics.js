////////////////////////////////////////////////////////////////
// sets up ground
function setupGround() {
    let groundX = 500;
    let groundY = 600;
    let groundWidth = 1000;
    let groundHeight = 40;

    ground = Bodies.rectangle(groundX, groundY, groundWidth, groundHeight, {
        isStatic: true,
        angle: 0
    });
    World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
// draws ground
function drawGround() {
    push();
    fill(128);
    drawVertices(ground.vertices, 135, 134, 131); // color = grey (uses RBG parameters set in drawVertices())
    pop();
}
////////////////////////////////////////////////////////////////
// sets up propeller
function setupPropeller() {
    /* 
    STEP 1 
    sets up a static body of type rectangle with following location and size 
    */
    let propellerX = 150;
    let propellerY = 480;
    let propellerWidth = 200;
    let propellerHeight = 15;

    propeller = Bodies.rectangle(propellerX, propellerY, propellerWidth, propellerHeight, {
        isStatic: true,
        angle: angle
    });
    World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
// updates and draws the propeller
function drawPropeller() {
    /* 
    STEP 2a
    sets the angle of the propeller equal to the global variable angle 
    sets the angular velocity equal to the global variable angleSpeed  
    updates the variable angle by angleSpeed
    draws the propeller using the drawVertices()
     */
    push();
    Body.setAngle(propeller, angle);
    Body.setAngularVelocity(propeller, angleSpeed);
    angle += angleSpeed;
    drawVertices(propeller.vertices);
    pop();
}
////////////////////////////////////////////////////////////////
// sets up bird
function setupBird(posX = mouseX, posY = mouseY) {
    let sides = 1;
    let size = 20;

    let bird = Bodies.polygon(posX, posY, sides, size, {
        friction: 0,
        restitution: 0.95
    });
    Matter.Body.setMass(bird, bird.mass * 10);
    World.add(engine.world, [bird]);
    birds.push(bird);
    return bird;
}
////////////////////////////////////////////////////////////////
//draws birds and checks if off screen
function drawBirds() {
    push();
    /* 
    STEP 3
    loops over the birds array and draws them using the drawVertices()
    */
    for (let i = 0; i < birds.length; i++) {
        drawVertices(birds[i].vertices, 255, 20, 0); // color = red (uses RBG parameters set in drawVertices())

        /* 
        checks if the bird has left the screen and, if it has, removes it 
        from the physics world and from the array
        */
        if (isOffScreen(birds[i])) {
            removeFromWorld(birds[i]);
            birds.splice(i, 1);
            i--;
        }
    }
    pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower() {
    /* 
    STEP 4
    creates a tower of six boxes high and three boxes wide
    each box is 80 x 80 
    */
    let towerHeight = 6;
    let towerWidth = 3;
    let boxOffset = 750;
    let boxX = 45;
    let boxY = 80;
    let boxWidth = 80;
    let boxHeight = 80;

    for (let i = 0; i < towerHeight; i++) {
        for (let j = 0; j < towerWidth; j++) {
            let tower = Bodies.rectangle(j * boxX + boxOffset, i * boxY, boxWidth, boxHeight, {
                isStatic: false,
                angle: angle
            });
            World.add(engine.world, [tower]);
            boxes.push(tower);

            //  pushes a random shades of green onto the colors array
            colors.push({
                r: random(0, 80),
                g: random(120, 220),
                b: random(0, 80)
            })
        }
    }
}
////////////////////////////////////////////////////////////////
// draws tower of boxes
function drawTower() {
    /* 
    STEP 5
    loops over the boxes array and draws each box using the drawVertices() 
    uses the random colors 
    */
    push();
    for (let i = 0; i < boxes.length; i++) {
        drawVertices(boxes[i].vertices, colors[i].r, colors[i].g, colors[i].b);

        /* 
        STEP 8
        checks if the box has left the screen and, if it has, removes it from 
        the physics world and from the array
        */
        if (isOffScreen(boxes[i])) {
            removeFromWorld(boxes[i]);
            boxes.splice(i, 1);
            i--;
        }
    }
    pop();
}
////////////////////////////////////////////////////////////////
// creates a slingShot bird and its constraint
function setupSlingshot() {
    /*
    STEP 6
    initializes the global variable slingshotBird as a body of type circle 
    circle has zero friction, restitution of 0.95 and mass of the slingshotBird 
    as ten times its original mass
    */
    let slingshotBirdX = 250;
    let slingshotBirdY = 50;
    let slingshotBirdRadius = 25;

    slingshotBird = Bodies.circle(slingshotBirdX, slingshotBirdY, slingshotBirdRadius, {
        friction: 0,
        restitution: 0.95
    });
    Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10);

    /* 
    initializes the global variable slingshotConstraint as a constraint 
    with stiffness of 0.01 and damping of 0.0001
    */
    slingshotConstraint = Constraint.create({
        pointA: { x: 200, y: 150 },
        bodyB: slingshotBird,
        pointB: { x: -1, y: -1 },
        length: 30,
        stiffness: 0.01,
        damping: 0.0001
    });
    World.add(engine.world, [birds, slingshotBird, slingshotConstraint]);
}
////////////////////////////////////////////////////////////////
// draws slingshot bird and its constraint
function drawSlingshot() {
    /* 
    STEP 7
    draws slingshot bird in orange color and its constraint in white
    */
    push();
    drawVertices(slingshotBird.vertices, 242, 182, 2); // color = orange (uses RBG parameters set in drawVertices())
    drawConstraint(slingshotConstraint); // if color is not specified, then white is used
    pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction() {
    var mouse = Mouse.create(canvas.elt);
    var mouseParams = {
        mouse: mouse,
        constraint: { stiffness: 0.05 }
    }
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(engine.world, mouseConstraint);
}