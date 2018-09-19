/**
 * Player object
 * 
 * @author Jani Nykänen
 */


// Constructor
var Player = function (z) {

    const LIMIT_X = 0.01;
    const LIMIT_Z = 0.06;

    // Position
    this.pos = { x: 0, y: 0, z: z };
    // Speed
    this.speed = { x: 0, y: 0, z: 0 };
    // Target speed
    this.target = { x: 0, y: 0, z: 0 };

    // Speed limits
    this.speedLimit = {x : LIMIT_X, z : LIMIT_Z};
}


// Update speed
Player.prototype.updateSpeed = function (speed, target, acc, tm) {

    if (speed < target) {

        speed += acc * tm;
        if (speed > target) {

            speed = target;
        }
    }
    else if (speed > target) {

        speed -= acc * tm;
        if (speed < target) {

            speed = target;
        }
    }

    return speed;
}


// Control
Player.prototype.control = function (vpad, tm) {

    const BRAKE_FACTOR = 0.001;
    const DELTA = 0.05;
    const X_BONUS = 3.0;

    // Horizontal
    this.target.x = 0.0;
    this.target.z = 0.0;
    if (Math.abs(vpad.stick.x) > DELTA) {

        this.target.x = vpad.stick.x * this.speedLimit.x;
        this.target.x *= 1.0 + X_BONUS * Math.abs(this.speed.z) / this.speedLimit.z;
    }

    // "Depth"
    if (vpad.stick.y < -DELTA) {

        this.target.z = -vpad.stick.y * this.speedLimit.z;
    }

    // Brakes
    if(vpad.stick.y > DELTA && this.speed.z > 0.0) {

        this.speed.z -= BRAKE_FACTOR * tm;
        if(this.speed.z < 0.0) {

            this.speed.z = 0.0;
        } 
        this.target.z = 0.0;
    }
}


// Move
Player.prototype.move = function (tm) {

    const ACCELERATION_X = 0.0020;
    const ACCELERATION_Z = 0.0010;
    const SLOW_MODIF = 0.80;

    // Calculate Z acceleration
    let accl = ACCELERATION_Z - (ACCELERATION_Z*SLOW_MODIF) *
        Math.min(1.0, Math.pow(this.speed.z / this.speedLimit.z, 2));

    // Update speeds
    this.speed.x = this.updateSpeed(
        this.speed.x, this.target.x, ACCELERATION_X, tm);
    this.speed.z = this.updateSpeed(
        this.speed.z, this.target.z, accl, tm);

    // Update position
    this.pos.x += this.speed.x * tm;
}


// Update camera
Player.prototype.updateCamera = function(cam, tm) {

    const MIN_DIST = 0.0025;
    const SPEED_FACTOR = 8;

    if(Math.abs(this.pos.x-cam) < MIN_DIST) 
        return cam;

    cam += (this.pos.x-cam) / SPEED_FACTOR * tm;

    return cam;
}



// Update
Player.prototype.update = function (vpad, camX, tm) {

    this.control(vpad, tm);
    this.move(tm);

    return this.updateCamera(camX, tm);
}


// Draw
Player.prototype.draw = function (g) {

    let p = g.project(this.pos.x, this.pos.y, this.pos.z);
    if(p == null) return;

    g.setGlobalColor(255, 0, 0);
    g.fillRect(p.x - 8, p.y - 16, 16, 16);
}
