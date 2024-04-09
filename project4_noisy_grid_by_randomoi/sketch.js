let canvasWidth = 500;
let canvasHeight = 500;
let stepSize = 20;
let gridWidth = 25;
let gridHeight = 25;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    angleMode(DEGREES);
}
///////////////////////////////////////////////////////////////////////
function draw() {
    background(125);

    colorGrid();
    compassGrid();
}

// STEPS: 1-3, 7
/**
 * constructor function to handle background color operations
 * @param {*} posX - mouseX, the system variable, contains the current horizontal position of the mouse
 */
function colorGrid(posX = mouseX) {
    push();
    let scale = 0.07;
    let colorOffSet = 0.07;
    let fcOffset = 0.004;
    let ndLod = 0.2; // number of octaves to be used by the noise
    let ndFalloff = 0.05; // falloff factor for each octave

    // STEP 1: 
    // creates a grid of 25 x 25 rectangles
    for (let i = 0; i < gridWidth; i++) {
        for (let j = 0; j < gridHeight; j++) {
            // STEP 7a:
            // changes the appearance of the spots of color
            // handles smoothness (detail produced by Perlin noise)
            noiseDetail(ndLod, ndFalloff);

            // STEP 2-3: 
            // generates 3D noise which changes with mouseX
            let n = noise(i * scale + colorOffSet, j * scale, (frameCount + posX) * fcOffset);

            // STEP 7a:
            // changes color of the colorGrid with the help of the noise()
            let c1 = color(187, 156, 247); // light purple color
            let c2 = color(250, 5, 54); // raspberry red color
            let c = lerpColor(c1, c2, n); // blends two colors and interpolates with noise()

            fill(c);
            noStroke(); // removes black grid lines
            rect(i * stepSize, j * stepSize, stepSize, stepSize);
        }
    }
    pop();
}

// STEPS: 4-7
/**
 * constructor function to handle compass lines operations
 * @param {*} posX - mouseX, the system variable, contains the current horizontal position of the mouse
 */
function compassGrid(posX = mouseX) {

    let offset1 = 1;
    let offset2 = 40;
    let noiseY = 0;
    let fcOffset = 0.00001;

    // STEP 4: 
    // creates a grid of 25 x 25 lines
    for (let y = 0; y < gridHeight; y++) {
        let noiseX = 0;
        for (let x = 0; x < gridWidth; x++) {
            let scaleX = 0.05;
            let scaleY = 0.002;

            // STEP 5:
            // generates 3D noise using the compass' x and y coordinates and frameCount
            // STEP 6: 
            // frameCount multiplied by mouseX coordinate increases speed of moving compass lines
            let ns = noise(noiseX * scaleX, noiseY * scaleY, fcOffset * frameCount * posX);

            // generates angle of the compass line between 0 and 720
            let angle = map(ns, 0, 1, 0, 720);

            noiseX += offset1;

            strokeWeight(2);

            push();

            // STEP 4: 
            // default position of lines (pointing up and at the center of each square)
            translate(x * stepSize + stepSize / 2, y * stepSize + stepSize / 2);
            rotate(angle);

            // STEP 7b:
            // changes color of the compass line with the help of noise()
            let colorX = 5;
            let colorY = 5;
            let fcColorOffset = 0.02; // offsets speed of change
            let colorNoise = noise(colorX, colorY, frameCount * fcColorOffset);
            let c1 = color(11, 2, 28); // dark purple color
            let c2 = color(163, 125, 232); // light purple color
            let c = lerpColor(c1, c2, colorNoise); // blends two colors and interpolates with noise()
            stroke(c);

            // STEP 7b:
            // changes the length of the compass lines
            // maps the line width from 0 to 20 (stepSize = 20) with the help of noise()
            let lineWidth = map(ns, 0, 1, 0, stepSize);

            // compass line changes width based on lineWidth value
            line(0, 0, lineWidth, 0);

            // STEP 7a:
            // changes style of the compass lines by adding a circle at the bottom of the line
            fill(c);
            circle(lineWidth, 0, 2);

            pop();
        }
        noiseY -= offset2;
    }
}