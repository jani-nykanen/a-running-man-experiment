/**
 * Decoration aka. off-road object
 * 
 * @author Jani Nykänen
 */


// Constructor
var Decoration = function() {

    this.pos = {x: 0, y: 0, z: 0};
    this.id = 0;
    this.exist = false;
    this.flip = 0;
}


// Create
Decoration.prototype.createSelf = function(x, y, z, id) {

    const MAX_ID = 9;

    this.pos.x = x;
    this.pos.y = y;
    this.pos.z = z;

    this.id = id == null ? ( (Math.random() * MAX_ID) | 0 ) : id;

    this.flip = Math.random() <= 0.5 ? Flip.Horizontal : Flip.None;

    this.exist = true;

    // Scale sizes
    this.sizes = [
        1.5, 1.5,
        1.5,
        1.0, 1.0,
        1.0, 1.0,
        1.25, 1.25,
    ];

    // Widths (for collision)
    this.widths = [
        1.0, 1.0, 1.0,
        0.5, 0.33, 1.25,
        1.0, 1.0, 1.25,
    ];

    // Height (for collision)
    this.heights = [
        1.5, 1.5, 1.5,
        0.33, 0.5, 1.5,
        1.5, 1.5, 1.5,
    ];
}


// Update
Decoration.prototype.update = function(speed, near, tm) {

    if(!this.exist) return;

    // Move
    this.pos.z -= speed * tm;

    // Check if outside the screen
    if(this.pos.z < near) {

        this.exist = false;
    }
}


// Player collision
Decoration.prototype.playerCollision = function(pl) {

    const DEPTH = 0.05;

    if(!this.exist) return;

    let w = this.widths[this.id];
    let h = this.heights[this.id];

    if(pl.speed.z > 0.0 && pl.pos.z > this.pos.z - DEPTH && pl.pos.z < this.pos.z + DEPTH
        && pl.pos.x > this.pos.x-w/2 && pl.pos.x < this.pos.x+w/2 
        && pl.pos.y > this.pos.y-h) {

        pl.speed.z = 0.0;
    }
}


// Draw
Decoration.prototype.draw = function(g, a) {

    const YOFF = 8;

    if(!this.exist) return;

    g.drawFlat3D(a.bitmaps.decorations,
        0, this.id * 48, 48, 48,
        this.pos.x, this.pos.y, this.pos.z,
        this.sizes[this.id], this.sizes[this.id],
        YOFF,
        this.flip, true);
        
}
