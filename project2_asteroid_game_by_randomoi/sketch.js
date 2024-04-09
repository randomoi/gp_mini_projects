var canvasWidth = 1200;
var canvasHeight = 800;
var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];
var score = 0; // STEP 11b: "game score"

//////////////////////////////////////////////////
function setup() {
    createCanvas(canvasWidth, canvasHeight);
    spaceship = new Spaceship();
    asteroids = new AsteroidSystem();

    // location and size of earth and its atmosphere
    atmosphereLoc = new createVector(width / 2, height * 2.9);
    atmosphereSize = new createVector(width * 3, width * 3);
    earthLoc = new createVector(width / 2, height * 3.1);
    earthSize = new createVector(width * 3, width * 3);
}

//////////////////////////////////////////////////
function draw() {
    background(0);
    sky();

    spaceship.run();
    asteroids.run();

    drawEarth();

    checkCollisions(spaceship, asteroids); // function that checks collision between various elements

    gameScore(); // function that handles game score
}

//////////////////////////////////////////////////
// draws earth and atmosphere
function drawEarth() {
    noStroke();
    // draw atmosphere
    fill(0, 0, 255, 50);
    ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x, atmosphereSize.y);
    // draw earth
    fill(100, 255);
    ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

//////////////////////////////////////////////////
// checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids) {
    /* STEP 5 and STEP 6
    Note: used the same for loop to save resources to check for 
    spaceship-2-asteroid collisions and asteroid-2-earth collisions
    */
    // spaceship-2-asteroid collisions and asteroid-2-earth collisions 
    // if spaceship-asteroid/asteroid-earth did not collide, game continues, otherwise, game ends and "GAME OVER" message is displayed
    for (let i = 0; i < asteroids.locations.length; i++) {
        if (isInside(spaceship.location, spaceship.size / 2, asteroids.locations[i], asteroids.diams[i] / 2) ||
            isInside(earthLoc, earthSize.y / 2, asteroids.locations[i], asteroids.diams[i] / 2)
        ) {
            gameOver();
        }

        /* STEP 10
        checks if bullets hit any asteroids, if hit, then destroy() is called
        */
        // bullet collisions
        // if bullets hit asteroids, the destroy() is called to remove asteroids; the score increments if asteroid is destroyed
        for (let j = 0; j < spaceship.bulletSys.bullets.length; j++) {
            if (isInside(spaceship.bulletSys.bullets[j], spaceship.bulletSys.diam / 2, asteroids.locations[i], asteroids.diams[i] / 2)) {
                spaceship.bulletSys.destroy(j);
                asteroids.destroy(i);
                score++;
            }
        }
    }

    // STEP 7
    // spaceship-2-earth collisions
    // if spaceship-earth did not collide, game continues, otherwise, game ends and "GAME OVER" message is displayed
    if (isInside(spaceship.location, spaceship.size / 2, earthLoc, earthSize.y / 2)) {
        gameOver();
    }

    // STEP 8
    // spaceship-2-atmosphere collisions
    // if spaceship is inside atmosphere the setNearEarth() is called, which creates pull effect
    if (isInside(spaceship.location, spaceship.size / 2, atmosphereLoc, atmosphereSize.y / 2)) {
        spaceship.setNearEarth();
    }

}

//////////////////////////////////////////////////
// helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB) {
    // STEP 4
    // NOTE: I did not need 3-5 lines and I wrote it all in two lines
    if (typeof locA == 'undefined' || typeof locB == 'undefined') return false;
    return dist(locA.x, locA.y, locB.x, locB.y) < sizeA + sizeB; // returns distance coordinates for two objects < object size A + object size B
}

//////////////////////////////////////////////////
function keyPressed() {
    if (keyIsPressed && keyCode === 32) { // if spacebar is pressed, fire!
        spaceship.fire();
    }
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver() {
    // styles game over message
    fill(255);
    textSize(80);
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2)
    noLoop();
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky() {
    push();
    while (starLocs.length < 300) {
        starLocs.push(new createVector(random(width), random(height)));
    }
    fill(255);
    for (var i = 0; i < starLocs.length; i++) {
        rect(starLocs[i].x, starLocs[i].y, 2, 2);
    }

    if (random(1) < 0.3) starLocs.splice(int(random(starLocs.length)), 1);
    pop();
}

/* 
STEP 11b: "game score"
keeps score of how many asteroids have been hit
*/
function gameScore() {
    // styles score
    textSize(20);
    fill('#ffffff');
    textAlign(LEFT);
    text('score:', 25, 40);
    textAlign(LEFT);
    text(score, 90, 40);
}

/* STEP 11c: 
makes the program get progressively harder by spawning asteroids 
more frequently as time goes by
*/
setInterval('asteroids.incRndCoef()', 5000); // every 5 seconds