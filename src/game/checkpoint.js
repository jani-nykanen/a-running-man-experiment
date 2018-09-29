/**
 * Checkpoint
 * 
 * @author Jani Nykänen
 */


// Constructor
var Checkpoint = function () {

    const WIDTH = 1.5 + 0.2;
    const HEIGHT = WIDTH * (48.0 / 64.0);

    this.width = WIDTH;
    this.height = HEIGHT;

    this.pos = { x: 0, y: 0, z: 0 };

    this.exist = false;
    this.drawSelf = false;
}


// Create
Checkpoint.prototype.createSelf = function (x, y, z) {

    this.pos.x = x;
    this.pos.y = y;
    this.pos.z = z;

    this.exist = true;
}


// Update
Checkpoint.prototype.update = function (pl, near, far, tm) {

    if(!this.exist) return;

    // If too far away, do not draw
    this.drawSelf = this.pos.z < far;

    // Move
    this.pos.z -= pl.speed.z * tm;

    // "Destroy" self (TEMP)
    if(this.pos.z < near) {

        this.exist = false;
    }
}


// Draw
Checkpoint.prototype.draw = function (g, a) {

    if (!this.exist || !this.drawSelf) return;

    // Draw sprite
    g.drawFlat3D(a.bitmaps.checkpoint, 0, 0, 64, 48,
        this.pos.x, this.pos.y, this.pos.z, this.width, this.height,
        0.0, Flip.None, true);
}
