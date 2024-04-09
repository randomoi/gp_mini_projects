let speed;
let canvasWidth = 900;
let canvasHeight = 700;
let sunSize = 200;
let earthSize = 80; // STEP 1a: 
let whiteMoonSize = 30; // STEP 4a:
let moonAsteroidSize = 20;
let GreenMoonSize = 2;
let GreenMoonQTY = 20;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
}

function draw() {
    background(0);
    speed = frameCount;

    translate(width / 2, height / 2);

    Sun();

    Earth();
    GreenMoon();


    push();
    WhiteMoon();
    MoonAsteroid();
    pop();
}

// celestial object prototype function
function celestialObj(c, size) {
    strokeWeight(5);
    fill(c);
    ellipse(0, 0, size, size);
    line(0, 0, size / 2, 0);
}

// orange sun rotates around its axis
function Sun() {
    push();
    rotate(radians(speed / 3)); //STEP 5: rotates sun around its axis at speed/3
    translate(0, 0);
    celestialObj(color(255, 150, 0), sunSize); // sun color = orange, sun size = 200
    pop();
}

// blue earth rotates around the sun
function Earth() {
    rotate(radians(speed)); // STEP 2: rotates earth around the sun
    translate(300, 0); // STEP 1b: orbit 300 pixels
    push();
    rotate(radians(speed)); // STEP 3: earth rotates around self 
    celestialObj(color(12, 4, 176), earthSize); // STEP 1a: earth color = blue, earth size = 80
    pop();
}

// white moon rotating around the blue earth
function WhiteMoon() {
    rotate(radians(-speed * 2)); // STEP 4c: rotates moon around the earth counterclockwise at speed*2
    translate(100, 0); // STEP 4b: orbit of 100 pixels
    push();
    rotate(PI / 4); // rotates object 45 degrees to achieve "the dark side of the moon" rotation, where earth doesn't see the "dark side" of the moon
    celestialObj(color(255, 255, 255), whiteMoonSize); // STEP 4a: moon color = white, moon size = 30
    pop();
}

/* 
STEP 6a
Extension 1: a pink asteroid rotating around the moon
*/
function MoonAsteroid() {
    push();
    rotate(radians(speed * 2)); // rotates asteroid around the moon
    translate(0, 40);
    push(); // note: I left this here as I wanted to show that I'm able to create "the dark side" rotation 
    rotate(PI / 2); // rotates object 90 degrees to achieve "the dark side of the asteroid" rotation, where moon doesn't see the "dark side" of the asteroid
    celestialObj(color(233, 66, 245), moonAsteroidSize); // moon asteroid color = pink, moon asteroid size = 20
    pop();
    pop();
}

/* 
STEP 6b
Extension 2: green moons rotating around the earth at different speed and in different direction
*/
function GreenMoon() {
    push();
    // handles green moons with different speeds and sizes
    for (let i = 0, j = 1; i < GreenMoonQTY; i++, j *= -1) {
        push();
        rotate(radians(speed * (i / 8) * j));
        translate(0, 120 + i * 2);
        push();
        rotate(PI / 2); // rotates object 90 degrees to achieve "the dark side of the moon" rotation, where earth doesn't see the "dark side" of the moon
        celestialObj(color(21, 133, 11), GreenMoonSize + i * 2); // moon color = green, smallest moon size = 2, which increments through the for loop
        pop();
        pop();
    }
    pop();
}