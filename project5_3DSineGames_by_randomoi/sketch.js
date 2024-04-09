let confLocs = []; // Step 5: created global variable
let confTheta = []; // Step 5: created global variable
let slider;
let boxHeightMul = 1;
let waveSpeed = 1;
let rotateSpeed = 0.5
let ps1, ps2, ps3;

function preload() {
    // image credit: https://github.com/randomoi
    imgIn = loadImage("assets/stopwar.jpg");
}

function setup() {
    // creates canvas with 900 width x 800 height 800 and WEBGL
    createCanvas(900, 800, WEBGL);
    // Step 5a: created a separate function setupConfetti() and called it here in setup() for better readability 
    setupConfetti()

    // sets angle mode to degrees
    angleMode(DEGREES);

    // Step 1b: places the camera at location (800, -600, 800) and points at the center of the scene
    // Step 4: camera continuously flies in a circle around the structure
    camera(800, -600, 800, 0, 0, 0, 0, 1, 0);

    // Step 7: calls sliders function
    sliders();
}

// draws boxes and confetti
function draw() {
    background(220);

    let locX = 800;
    let locY = -600;
    let locZ = 800;

    // creates an ambient light with the dark grey color
    ambientLight(60, 60, 60);

    // creates a point light with the white color and position coordinates
    pointLight(255, 255, 255, locX, locY, locZ);

    // slider rotation speed 
    rotateSpeed = sliderRotateSp.value();
    // slider y rotation
    rotateY(frameCount * rotateSpeed);
    // slider box height
    boxHeightMul = sliderBoxH.value();
    // slider wave speed
    waveSpeed = sliderWaveSp.value();
    // calls boxes
    boxes();
    // calls confetti
    confetti();
}

// function to handles boxes
function boxes() {
    push();

    // Step 2: sets the material to normal - commented out code as per Step 7
    //normalMaterial();
    //ambientMaterial(250);
    //specularMaterial(250);

    // sets the texture to an image that will be used to render boxes
    texture(imgIn);
    // sets the stroke to zero 
    stroke(0);
    // stroke weight of 2 to better distinguish the boxes
    strokeWeight(2);

    // Step 1a: creates a grid of boxes of size 50x50x50 from -400 to 400 in the x-axis and -400 to 400 on the z-axis
    for (let x = -400; x < 400; x += 50) {
        for (let z = -400; z < 400; z += 50) {
            push();
            // Step 3
            // calculates for each box distance from the center of the coordinate system using its x and z coordinates and dist()
            let distance = dist(x, 0, z, 0, 0, 0);
            // modulates length value from 100 to 300 using the sin() function and the distance variable
            let length = map(sin(distance + frameCount * waveSpeed), -1, 1, 100 * boxHeightMul, 300 * boxHeightMul);
            // translates the position of boxes
            translate(x, 0, z);
            // sets the height of the boxes with length variable
            box(50, length, 50);
            pop();
        }
    }
    pop();
}

// Step 5b: 
// function to handles confetti
function confetti() {
    push();
    // sets the current material as a normal material
    normalMaterial();
    noStroke();
    // loops over the confLocs array
    for (let i = 0; i < confLocs.length; i++) {
        push()
        translate(confLocs[i].x, confLocs[i].y, confLocs[i].z); // translates to the location of 3D vector
        rotateX(confTheta[i] + frameCount * 10); // Step 6: rotates by the corresponding theta
        plane(15, 15); // pane size 15 x 15
        pop();
        // Step 6
        // increments the y-coordinate of the specific confetti by 1
        confLocs[i].y++;
        // checks if the y-coordinate of the confetti is greater than 0 (if reached the middle of the coordinate system)
        // if it is, sets the vector’s y component to -800, so that the confetti starts at the top of our world
        if (confLocs[i].y >= 0) confLocs[i].y = -800;
    }
    pop();
}

// Step 5a: moved it out of setup() for better readability
// function to handle set up of confetti
function setupConfetti() {
    confLocs = [];
    confTheta = [];
    // loops over to push 200 3D vectors into confLocs the x component of the vector with
    // random values ranging from -500 to 500, the y component from -800 to 0 and the z component from -500 to 500
    for (let i = 0; i < 200; i++) {
        confLocs.push(
            new p5.Vector(random(-500, 500), random(-800, 0), random(-500, 500))
        );
        // pushes a random angle from 0 to 360 onto the confTheta array
        confTheta.push(random(0, 360));
    }
}

// Step 7
// function to handle sliders
// https://p5js.org/reference/#/p5/createP
// https://p5js.org/reference/#/p5/createSlider
// https://p5js.org/reference/#/p5.Element/position
// https://p5js.org/reference/#/p5.Element/style
function sliders() {
    // slider for box height 
    ps1 = createP("box height"); // creates a <p></p> element in the DOM
    ps1.position(10, 5); // text position
    sliderBoxH = createSlider(0.1, 2, 1, 0.1); // creates a slider <input></input> element in the DOM, createSlider(min, max, [value], [step])
    sliderBoxH.position(10, 35); // position of slider
    sliderBoxH.style('width', '80px'); // sets the given style (CSS) property (width) of the element with the given value (px size)

    // slider for rotation speed 
    ps2 = createP("rotation speed"); // creates a <p></p> element in the DOM
    ps2.position(10, 35); // text position
    sliderRotateSp = createSlider(0.1, 2, 0.5, 0.1); // creates a slider <input></input> element in the DOM, createSlider(min, max, [value], [step])
    sliderRotateSp.position(10, 65); // position of slider
    sliderRotateSp.style('width', '80px'); // sets the given style (CSS) property (width) of the element with the given value (px size)

    // slider for wave speed 
    ps3 = createP("wave speed"); // creates a <p></p> element in the DOM
    ps3.position(10, 65); // text position
    sliderWaveSp = createSlider(0.1, 5, 1, 0.1); // creates a slider <input></input> element in the DOM, createSlider(min, max, [value], [step])
    sliderWaveSp.position(10, 95); // position of slider
    sliderWaveSp.style('width', '80px'); // sets the given style (CSS) property (width) of the element with the given value (px size)
}