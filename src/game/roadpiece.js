/**
 * Road piece
 * 
 * @author Jani Nykänen
 */


// Constructor
var RoadPiece = function (width, depth) {

    this.width = width;
    this.depth = depth;

    this.startX = 0;
    this.endX = 0;
    this.z = 0;

    this.exist = false;
}


// Create
RoadPiece.prototype.createSelf = function (sx, ex, z) {

    this.startX = sx;
    this.endX = ex;
    this.z = z;

    this.exist = true;
}


// Update
RoadPiece.prototype.update = function (globalSpeed, near, tm) {

    if (!this.exist) return false;

    // Move
    this.z -= globalSpeed * tm;
    if (this.z < near) {

        this.exist = false;
        return true;
    }

    return false;
}


// Draw
RoadPiece.prototype.draw = function (g) {

    if (!this.exist) return;

    g.drawFloorRect(this.startX - this.width / 2, this.endX - this.width / 2,
        0, this.z,
        this.width, this.depth,
        true);
}


// Player collision
RoadPiece.prototype.playerCollision = function (pl) {

    const DELTA = 0.05;

    if (!this.exist) return;

    let p = pl.pos;

    if (!pl.canJump || p.z < this.z || p.z > this.z + this.depth)
        return;

    let w = this.width / 2 + DELTA;

    let x1 = this.startX - w;
    let z1 = this.z;
    let x2 = this.startX + w;
    let z2 = this.z;
    let x3 = this.endX - w;
    let z3 = this.z + this.depth;
    let x4 = this.endX + w;
    let z4 = this.z + this.depth;

    // Check if inside the road area
    if(isInsideTriangle(p.x, p.z, x1, z1, x2, z2, x3, z3) ||
    isInsideTriangle(p.x, p.z, x3, z3, x4, z4, x2, z2) ) {

        pl.touchRoad = true;
    }
}
