/**
 * Enemy base
 * 
 * @author Jani Nykänen
 */


// Constructor
var Enemy = function () {

    const BASE_ACC_X = 0.0020;
    const BASE_ACC_Y = 0.0020;
    const BASE_ACC_Z = 0.0020;

    // Position & speed
    this.pos = { x: 0, y: 0, z: 0 };
    this.speed = { x: 0, y: 0, z: 0 };
    this.target = { x: 0, y: 0, z: 0 };
    // Acceleration
    this.acc = {x: BASE_ACC_X, y: BASE_ACC_Y, z: BASE_ACC_Z};

    // Sprite
    this.spr = new Sprite(48, 48);
    this.flip = Flip.None;

    // Id
    this.id = 0;
    // Does exist
    this.exist = false;

    // Dimensions
    this.width = 1.0;
    this.height = 1.0;
}


// Create self
Enemy.prototype.createSelf = function(x, y, z) {

    this.pos.x = x;
    this.pos.y = y;
    this.pos.z = z;

    this.speed.x = 0.0;
    this.speed.y = 0.0;
    this.speed.z = 0.0;

    this.target.x = 0.0;
    this.target.y = 0.0;
    this.target.z = 0.0;

    this.exist = true;
}


// Update speed
Enemy.prototype.updateSpeed = function (speed, target, acc, tm) {

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


// Update
Enemy.prototype.update = function(pl, near, tm) {

    if(!this.exist) return;

    // Base movement closer to camera
    this.pos.z -= pl.speed.z * tm;

    // Update speeds
    this.speed.x = this.updateSpeed(this.speed.x, this.target.x, this.acc.x, tm);
    this.speed.y = this.updateSpeed(this.speed.y, this.target.y, this.acc.y, tm);
    this.speed.z = this.updateSpeed(this.speed.z, this.target.z, this.acc.z, tm);

    // Move
    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;
    this.pos.z += this.speed.z * tm;

    // Check if too close
    if(this.pos.z < near) {

        this.exist = false;
        return;
    }

    // Call custom update function
    if(this.onUpdate != null) {

        this.onUpdate(pl, tm);
    }

    // Call custom animation function
    if(this.animate != null) {

        this.animate(tm);
    }
}


// Draw
Enemy.prototype.draw = function(g, a) {

    const YJUMP = 18;
    const SHADOW_WIDTH = 1.0;
    const SHADOW_HEIGHT = 0.60;

    if(!this.exist) return;

    // Draw shadow
    g.drawFlat3D(a.bitmaps.shadow, 0, 24, 24, 24, this.pos.x, 0.0, this.pos.z,
        SHADOW_WIDTH * this.width, SHADOW_HEIGHT*this.height, 12, Flip.None);

    // Draw sprite
    this.spr.draw3D(g, a.bitmaps.enemies, this.pos.x, this.pos.y, this.pos.z,
        this.width, this.height, YJUMP, this.flip, true);
}
