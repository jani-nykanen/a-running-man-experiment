/**
 * Enemy base
 * 
 * @author Jani Nykänen
 */


// Constructor
var Enemy = function () {

    // Position & speed
    this.pos = { x: 0, y: 0, z: 0 };
    this.speed = { x: 0, y: 0, z: 0 };
    this.target = { x: 0, y: 0, z: 0 };

    // Sprite
    this.spr = new Sprite(32, 32);
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


// Update
Enemy.prototype.update = function(pl, near, tm) {

    if(!this.exist) return;

    // Base movement
    this.pos.z -= pl.speed.z * tm;

    // Check if too close
    if(this.pos.z < near) {

        this.exist = false;
        return;
    }

    // Call custom update function
    if(this.onUpdate != null) {

        this.onUpdate(pl, near, tm);
    }

    // Call custom animation function
    if(this.animate != null) {

        this.animate(tm);
    }
}


// Draw
Enemy.prototype.draw = function(g, a) {

    const YJUMP = 4;

    if(!this.exist) return;

    // Draw sprite
    this.spr.draw3D(g, a.bitmaps.enemies, this.pos.x, this.pos.y, this.pos.z,
        this.width, this.height, YJUMP, this.flip, true);
}