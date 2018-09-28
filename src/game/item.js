/**
 * Item object
 * 
 * @author Jani Nykänen
 */


// Constructor
var Item = function () {

    const DEFAULT_SIZE = 0.4;

    this.id = 0;
    this.exist = false;
    this.pos = { x: 0, y: 0, z: 0 };

    // Dimensions
    this.w = DEFAULT_SIZE;
    this.h = DEFAULT_SIZE;

    // Sprite
    this.spr = new Sprite(24, 24);

    // Wave
    this.wave = 0.0;
}


// Create
Item.prototype.createSelf = function (x, y, z, id) {

    this.pos.x = x;
    this.pos.y = y;
    this.pos.z = z;
    this.id = id;

    this.spr.row = this.id;

    this.exist = true;
}


// Player collision
Item.prototype.playerCollision = function (pl) {

    const PL_WIDTH = 0.0;
    const DEPTH = 0.1;

    if(pl.pos.x + PL_WIDTH > this.pos.x-this.w/2 
    && pl.pos.x - PL_WIDTH < this.pos.x+this.w/2
    && pl.pos.y > this.pos.y-this.h/2
    && pl.pos.z > this.pos.z-DEPTH
    && pl.pos.z < this.pos.z+DEPTH + pl.speed.z) {

        this.exist = false;
    }
}


// Update
Item.prototype.update = function (pl, near, tm) {

    const ANIM_SPEED = 6;
    const WAVE_SPEED = 0.1;

    if (!this.exist) return;

    // Move
    this.pos.z -= pl.speed.z * tm;
    if (this.pos.z < near) {

        this.exist = false;
    }

    // Animate
    this.spr.animate(this.id, 0, 4, ANIM_SPEED, tm);

    // Update wave
    this.wave += WAVE_SPEED * tm;

    // Player collision
    this.playerCollision(pl);
}


// Draw
Item.prototype.draw = function (g, a) {

    const SHADOW_WIDTH = 0.5;
    const SHADOW_HEIGHT = 0.30;
    const AMPLITUDE = 0.025;

    if (!this.exist) return;

    // Draw shadow
    g.drawFlat3D(a.bitmaps.shadow, 0, 0, 24, 24, this.pos.x, 0.0, this.pos.z,
        SHADOW_WIDTH, SHADOW_HEIGHT, 4, Flip.None);

    // Draw sprite
    this.spr.draw3D(g, a.bitmaps.items, this.pos.x,
        this.pos.y + Math.sin(this.wave) * AMPLITUDE,
        this.pos.z,
        this.w, this.h, Flip.None);
}
