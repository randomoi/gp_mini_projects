class BulletSystem {

    constructor() {
        this.bullets = [];
        this.velocity = new createVector(0, -5);
        this.diam = 10;
    }

    run() {
        this.move();
        this.draw();
        this.edges();
    }

    fire(x, y) {
        this.bullets.push(createVector(x, y));
    }

    // draws all bullets
    draw() {
        fill(245, 72, 66);
        for (var i = 0; i < this.bullets.length; i++) {
            ellipse(this.bullets[i].x, this.bullets[i].y, this.diam, this.diam);
        }
    }

    // updates the location of all bullets
    move() {
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].y += this.velocity.y;
        }
    }

    /* STEP 1
    checks if bullets left the screen and removes them from the array
    NOTE: decided to move this.bullets.splice() to destroy() 
    for better readibillity and accessibility
    */
    edges() {
            for (var i = 0; i < this.bullets.length; i++) {
                if (this.bullets[i].y < 0) {
                    this.destroy(i);
                };
            }
        }
        // destroys all data associated with bullet
    destroy(index) {
        this.bullets.splice(index, 1);
    }
}