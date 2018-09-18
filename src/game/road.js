/**
 * A road generator
 * 
 * @author Jani Nykänen
 */


// ------ Road piece ------- //

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

    if (!this.exist) return;

    // Move
    this.z -= globalSpeed * tm;
    if (this.z < near) {

        this.exist = false;
    }
}


// Draw
RoadPiece.prototype.draw = function (g) {

    if (!this.exist) return;

    g.drawFloorRect(this.startX - this.width / 2, this.endX - this.width / 2,
        0, this.z,
        this.width, this.depth,
        true);
}


// ------ Actual road ------- //


// Constructor
var Road = function () {

    const ROAD_STEP = 0.5;
    const ROAD_WIDTH = 1.0;
    const ROAD_COUNT = 32;
    const START_POS = 8.0;

    // Road pieces
    this.pieces = new Array(ROAD_COUNT);
    for (let i = 0; i < this.pieces.length; ++i) {

        this.pieces[i] = new RoadPiece(ROAD_WIDTH, ROAD_STEP);
    }

    // Creation timer
    this.creationTimer = 0.0;
    // Timer max
    this.timerMax = ROAD_STEP;
    // Start pos
    this.startPos = START_POS;
    // Creation positions
    this.oldX = 0.0;
    this.creationX = 0.0;

    // TEMP timer
    this.tempTimer = 0.0;

}


// The name says it all
Road.prototype.getNextRoadPieceIndex = function () {

    for (let i = 0; i < this.pieces.length; ++i) {

        if (!this.pieces[i].exist)
            return i;
    }
    return 0;
}


// Update
Road.prototype.update = function (globalSpeed, tm) {

    // Update temp timer
    this.tempTimer += 0.05 * tm;

    // Update timer
    this.creationTimer += globalSpeed * tm;
    if (this.creationTimer >= this.timerMax) {

        this.creationX = Math.sin(this.tempTimer) * 0.5;

        // Create a road piece
        let i = this.getNextRoadPieceIndex();
        this.pieces[i].createSelf(this.oldX, this.creationX, this.startPos);

        this.creationTimer -= this.timerMax;

        this.oldX = this.creationX;
    }

    // Update road pieces
    for (let i = 0; i < this.pieces.length; ++i) {

        this.pieces[i].update(globalSpeed, 0.5, tm);
    }
}


// Draw
Road.prototype.draw = function (g) {

    // Set "gradient"
    g.setFloorRectGradient(72, 72+32, 
        85, 48, 0, 
        192, 144, 64);

    // Draw road pieces
    for (let i = 0; i < this.pieces.length; ++i) {

        this.pieces[i].draw(g);
    }
}
