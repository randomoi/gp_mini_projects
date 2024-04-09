class Spaceship {

    constructor() {
        this.velocity = new createVector(0, 0);
        this.location = new createVector(width / 2, height / 2);
        this.acceleration = new createVector(0, 0);
        this.maxVelocity = 5;
        this.bulletSys = new BulletSystem();
        this.size = 50;
        this.left_flow = false;
        this.right_flow = false;
        this.up_flow = false;
        this.down_flow = false;
    }

    run() {
        this.bulletSys.run();
        this.draw();
        this.move();
        this.edges();
        this.interaction();
    }

    draw() {
        fill(125);
        triangle(this.location.x - this.size / 2, this.location.y + this.size / 2,
            this.location.x + this.size / 2, this.location.y + this.size / 2,
            this.location.x, this.location.y - this.size / 2);

        /* STEP 11a: "spaceship thrusters"
        makes the spaceship pretty by adding jets thrusters, 
        which activate from the opposite side of movement 
        */
        fill('#eb8034');
        if (this.left_flow) { // if left arrow key is pressed than the right thruster is activated
            ellipse(this.location.x - this.size / 2, this.location.y, this.size / 2, this.size / 10);
        }
        if (this.right_flow) { // if right arrow key is pressed than the left thruster is activated
            ellipse(this.location.x + this.size / 2, this.location.y, this.size / 2, this.size / 10);
        }
        if (this.up_flow) { // if up arrow key is pressed than the down thruster is activated
            ellipse(this.location.x, this.location.y + this.size / 1.3, this.size / 10, this.size / 2);
        }
        if (this.down_flow) { // if down arrow key is pressed than the up thruster is activated
            ellipse(this.location.x, this.location.y - this.size / 1.5, this.size / 10, this.size / 2);
        }
        this.left_flow = false;
        this.right_flow = false;
        this.up_flow = false;
        this.down_flow = false;
    }

    /* STEP 3 
    moves the spaceships
    the spaceship continues moving unless the rockets are 
    fired up in the opposite direction
    */
    move() {
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
        this.velocity.limit(this.maxVelocity); // limits velocity to declared speed in constructor()
    }

    applyForce(f) {
        this.acceleration.add(f);
    }

    /* STEP 9a
    force "friction" that's 30 times smaller than the velocity of the spaceship, 
    points the opposite direction to velocity and is then applied in the opposite direction
    */
    friction() {
        if (this.velocity.x > 0) this.applyForce(createVector(-this.velocity.x / 30, 0)); // friction for x > 0 coordinate
        if (this.velocity.x < 0) this.applyForce(createVector(-this.velocity.x / 30, 0)); // friction for x < 0 coordinate
        if (this.velocity.y < 0) this.applyForce(createVector(0, -this.velocity.y / 30)); // friction for y < 0 coordinate
        if (this.velocity.y > 0) this.applyForce(createVector(0, -this.velocity.y / 30)); // friction for y > 0 coordinate
    }

    // keypad interactions (left, right, up, down) for the spaceship
    interaction() {

        if (keyIsDown(LEFT_ARROW)) {
            this.applyForce(createVector(-0.1, 0)); // moves spaceship in left direction if "left arrow" key is pressed
            this.right_flow = true; // STEP 11a: right thruster is activated if left arrow is used
        }

        if (keyIsDown(RIGHT_ARROW)) {

            this.applyForce(createVector(0.1, 0)); // STEP 2: moves spaceship in right direction if "right arrow" key is pressed
            this.left_flow = true; // STEP 11a: left thruster is activated if right arrow is used
        }

        if (keyIsDown(UP_ARROW)) {

            this.applyForce(createVector(0, -0.1)); // STEP 2: moves spaceship in up direction if "up arrow" key is pressed
            this.up_flow = true; // STEP 11a: down thruster is activated if up arrow is used
        }

        if (keyIsDown(DOWN_ARROW)) {

            this.applyForce(createVector(0, 0.1)); // STEP 2: moves spaceship in down direction if "down arrow" key is pressed
            this.down_flow = true; // STEP 11a: up thruster is activated if down arrow is used
        }
    }

    fire() {
        this.bulletSys.fire(this.location.x, this.location.y);
    }

    edges() {
        if (this.location.x < 0) this.location.x = width;
        else if (this.location.x > width) this.location.x = 0;
        else if (this.location.y < 0) this.location.y = height;
        else if (this.location.y > height) this.location.y = 0;
    }

    setNearEarth() {
        /* STEP 9b
        NOTE: created friction() as a separate function (see above) 
        to follow the original code pattern and for better readability  
        */
        this.applyForce(createVector(0, 0.05));
        this.friction();
    }
}