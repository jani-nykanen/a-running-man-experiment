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

    this.pos.x = x;
    this.pos.y = y;
    this.pos.z = z;

    this.id = id;

    this.flip = Math.random() <= 0.5 ? Flip.Horizontal : Flip.None;

    this.exist = true;
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


// Draw
Decoration.prototype.draw = function(g, a) {

    if(!this.exist) return;

    g.drawFlat3D(a.bitmaps.decorations,
        0, this.id * 48, 48, 48,
        this.pos.x, this.pos.y, this.pos.z,
        1.5, 1.5, 3,
        this.flip, true);
        
}
