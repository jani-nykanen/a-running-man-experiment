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
    this.speedLimit = { x: LIMIT_X, z: LIMIT_Z };

    // Can jump
    this.canJump = false;
    // Has double jumped
    this.doubleJump = false;

    // Sprite
    this.spr = new Sprite(24, 24);
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
    const GRAVITY = 0.025;
    const JUMP_HEIGHT = 0.05;
    const DOUBLE_JUMP_HEIGHT = 0.035;
    const JUMP_END_DIVISOR = 2;

    // Default
    this.target.x = 0.0;
    this.target.z = 0.0;
    this.target.y = GRAVITY;

    // Horizontal
    if (Math.abs(vpad.stick.x) > DELTA) {

        this.target.x = vpad.stick.x * this.speedLimit.x;
        this.target.x *= 1.0 + X_BONUS * Math.abs(this.speed.z) / this.speedLimit.z;
    }

    // "Depth"
    if (vpad.stick.y < -DELTA) {

        this.target.z = -vpad.stick.y * this.speedLimit.z;
    }

    // Brakes
    if (vpad.stick.y > DELTA && this.speed.z > 0.0) {

        this.speed.z -= BRAKE_FACTOR * tm;
        if (this.speed.z < 0.0) {

            this.speed.z = 0.0;
        }
        this.target.z = 0.0;
    }

    // Jump
    let f1 = vpad.buttons.fire1;
    let f2 = vpad.buttons.fire2;
    if ((f1 == State.Pressed  || f2 == State.Pressed)) {

        if(this.canJump)
            this.speed.y = -JUMP_HEIGHT;

        else if(!this.doubleJump) {

            this.speed.y = -DOUBLE_JUMP_HEIGHT;
            this.doubleJump = true;
        }
    }
    else if (this.speed.y < 0.0 && !this.canJump && (f1 == State.Released || f2 == State.Released)) {

        this.speed.y /= JUMP_END_DIVISOR;
    }
}


// Move
Player.prototype.move = function (tm) {

    const ACCELERATION_X = 0.0020;
    const ACCELERATION_Z = 0.0010;
    const GRAVITY_ACC = 0.002;
    const SLOW_MODIF = 0.80;

    // Calculate Z acceleration
    let accl = ACCELERATION_Z - (ACCELERATION_Z * SLOW_MODIF) *
        Math.min(1.0, Math.pow(this.speed.z / this.speedLimit.z, 2));

    // Update speeds
    this.speed.x = this.updateSpeed(
        this.speed.x, this.target.x, ACCELERATION_X, tm);
    this.speed.z = this.updateSpeed(
        this.speed.z, this.target.z, accl, tm);
    this.speed.y = this.updateSpeed(
        this.speed.y, this.target.y, GRAVITY_ACC, tm);

    // Update position
    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;

    // Floor collision
    this.canJump = false;
    if (this.pos.y >= 0.0 && this.speed.y >= 0.0) {

        this.pos.y = 0.0;
        this.speed.y = 0.0;
        this.canJump = true;
        this.doubleJump = false;
    }
}


// Animate
Player.prototype.animate = function(tm) {

    const DELTA = 0.0001;
    const JUMP_DELTA = 0.01;
    const DJUMP_SPEED = 4;

    // Double jumping
    if(this.doubleJump) {
        
        this.spr.animate(0, 8, 11, DJUMP_SPEED, tm);
    }
    // Jumping
    else if(!this.canJump) {

        let frame = 4; 
        if(this.speed.y < 0.0) {

            if(this.speed.y > -JUMP_DELTA) {

                frame = 5;
            }
        }
        else if(this.speed.y >= 0.0) {
            
            frame = 5 + Math.floor(this.speed.y / JUMP_DELTA);
            if(frame > 7) frame = 7;
        }

        this.spr.animate(0, frame, frame, 0, tm);

    }
    else {

        // Running
        let totalSpeed = Math.hypot(this.speed.x, this.speed.z);
        if(totalSpeed < DELTA) {

            this.spr.animate(0, 0, 0, 0, tm);
        }
        else {

            let speed = 12-Math.floor(totalSpeed / 0.01);
            this.spr.animate(0, 0, 3, speed, tm);
        }

    }
}


// Update camera
Player.prototype.updateCamera = function (cam, tm) {

    const MIN_DIST = 0.0025;
    const SPEED_FACTOR = 8;

    if (Math.abs(this.pos.x - cam) < MIN_DIST)
        return cam;

    cam += (this.pos.x - cam) / SPEED_FACTOR * tm;

    return cam;
}



// Update
Player.prototype.update = function (vpad, camX, tm) {

    // Control
    this.control(vpad, tm);
    // Move
    this.move(tm);
    // Animate
    this.animate(tm);

    // Update camera
    return this.updateCamera(camX, tm);
}


// Draw
Player.prototype.draw = function (g, a) {

    const SHADOW_DIVISOR = 0.175;

    let p = g.project(this.pos.x, this.pos.y, this.pos.z);
    if (p == null) return;

    // Draw shadow
    let sy = g.project(this.pos.x, 0.0, this.pos.z).y;
    let frame = Math.floor(Math.abs(this.pos.y) / SHADOW_DIVISOR);
    g.drawBitmapRegion(a.bitmaps.shadow, 24 * frame, 0, 24, 24, p.x-12, sy-20);

    // Draw sprite
    this.spr.draw(g, a.bitmaps.player, p.x - 12, p.y - 20);
}
