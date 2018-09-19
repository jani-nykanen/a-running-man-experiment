/**
 * Player object
 * 
 * @author Jani Nykänen
 */


// Constructor
var Player = function () {

    // Position
    this.pos = { x: 0, y: 0, z: 0 };
    // Speed
    this.speed = { x: 0, y: 0, z: 0 };
    // Target speed
    this.target = { x: 0, y: 0, z: 0 };
}


// Update speed
Player.prototype.updateSpeed = function(speed, target, acc, tm) {

    if(speed < target) {

        speed += acc * tm;
        if(speed > target) {

            speed = target;
        }
    }
    else if(speed > target) {

        speed -= acc * tm;
        if(speed < target) {

            speed = target;
        }
    }

    return speed;
}


// Control
Player.prototype.control = function(vpad, tm) {

    const TARGET_X = 2.0;
    const TARGET_Z = 2.0;

    const DELTA = 0.05;
    // Horizontal
    if(Math.abs(vpad.stick.x) > DELTA) {

        this.target.x = vpad.stick.x * TARGET_X;
    }

    // "Depth"
    if(vpad.stick.y < DELTA) {

        this.target.z = -vpad.stick.y * TARGET_Z;
    }
}


// Move
Player.prototype.move = function(tm) {

    const ACCELERATION_X = 0.1;
    const ACCELERATION_Z = 0.05;

    // Update speeds
    this.speed.x = this.updateSpeed(
        this.speed.x, this.target.x, ACCELERATION_X, tm);
    this.speed.z = this.updateSpeed(
        this.speed.z, this.target.z, ACCELERATION_Z, tm);
}



// Update
Player.prototype.update = function(vpad, tm) {

    this.control(vpad, tm);
    this.move(tm);
}


// Draw
Player.prototype.draw = function(g) {

}
