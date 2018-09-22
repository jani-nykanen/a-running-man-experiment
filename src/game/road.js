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


// ------ Actual road ------- //


// Constructor
var Road = function () {

    const ROAD_STEP = 0.5;
    const ROAD_WIDTH = 1.5;
    const ROAD_COUNT = 32;
    const START_POS = 8.0;

    // Road pieces
    this.pieces = new Array(ROAD_COUNT);
    // Create default road
    for (let i = 0; i < this.pieces.length; ++i) {

        this.pieces[i] = new RoadPiece(ROAD_WIDTH, ROAD_STEP);
        if (i < START_POS / ROAD_STEP) {

            this.pieces[i].createSelf(0, 0, i * ROAD_STEP);
        }
    }

    // Creation timer
    this.creationTimer = ROAD_STEP;
    // Timer max
    this.timerMax = ROAD_STEP;
    // Start pos
    this.startPos = START_POS;
    // Creation positions
    this.oldX = 0.0;
    this.creationX = 0.0;

    // Curvature delta speed
    this.curvDelta = 0.0;
    // Curvature
    this.curvature = 0.0;
    // Curvature target
    this.curvTarget = 0.0;
    // Curvature time step
    this.curvStep = 0.0;
    // Curvature change time
    this.curvTimer = 0.0;
}


// The name says it all
Road.prototype.getNextRoadPieceIndex = function () {

    for (let i = 0; i < this.pieces.length; ++i) {

        if (!this.pieces[i].exist)
            return i;
    }
    return 0;
}


// Create a new road piece
Road.prototype.createNewRoadPiece = function (x, z) {

    this.creationX = this.oldX + x;

    // Create a road piece
    let i = this.getNextRoadPieceIndex();
    this.pieces[i].createSelf(this.oldX, this.creationX, z + this.startPos);

    this.oldX = this.creationX;
}


// Update curvature
Road.prototype.updateCurvature = function (speed, tm) {

    const CURV_LIMIT = 1.5;
    const SPEED_MAX = 0.060;

    const CURVE_MIN = 10;
    const CURVE_MAX = 190;

    const TARGET_BASE = 0.05;
    const TARGET_SPEED_FACTOR = 4.0;

    speed = Math.abs(speed) / SPEED_MAX;

    // Update curvature
    if (this.curvDelta < this.curvTarget) {

        this.curvDelta += this.curvStep * speed * tm;
        if (this.curvDelta > this.curvTarget) {

            this.curvDelta = this.curvTarget;
        }
    }
    else if (this.curvDelta > this.curvTarget) {

        this.curvDelta -= this.curvStep * speed * tm;
        if (this.curvDelta < this.curvTarget) {

            this.curvDelta = this.curvTarget;
        }
    }
    this.curvature += this.curvDelta * speed * tm;

    // Limit curvature
    if (this.curvature > CURV_LIMIT) {

        this.curvTarget = -Math.abs(this.curvature - CURV_LIMIT);
        this.curvDelta = 0.0;
        this.curvature = CURV_LIMIT;
    }

    else if (this.curvature < -CURV_LIMIT) {

        this.curvTarget = Math.abs(this.curvature - (-CURV_LIMIT));
        this.curvDelta = 0.0;
        this.curvature = -CURV_LIMIT;
    }

    // Update curvature timer
    this.curvTimer -= speed * tm;
    if (this.curvTimer <= 0.0) {

        this.curvDelta = 0.0;

        this.curvTimer = Math.random() * CURVE_MAX + CURVE_MIN;
        this.curvTarget = (Math.random() * 2 - 1.0) * TARGET_BASE
            * (1.0 + TARGET_SPEED_FACTOR * this.curvTimer / (CURVE_MIN + CURVE_MAX));

        this.curvStep = Math.abs(this.curvTarget) / this.curvTimer;
    }
}


// Update
Road.prototype.update = function (globalSpeed, pl, tm) {

    const CURVATURE_FACTOR = 0.2;
    const NEAR = 0.5;

    // Update timer
    this.creationTimer += globalSpeed * tm;

    // Update curvature
    this.updateCurvature(globalSpeed, tm);

    // Update road pieces
    for (let i = 0; i < this.pieces.length; ++i) {

        // Player collision
        this.pieces[i].playerCollision(pl);

        // Update
        if (this.pieces[i].update(globalSpeed, NEAR, tm)) {

            // Create a new road piece
            this.createNewRoadPiece(
                this.curvature * CURVATURE_FACTOR,
                this.pieces[i].z);
        }
    }

}


// Draw
Road.prototype.draw = function (g) {

    // Set "gradient"
    g.setFloorRectGradient(72, 72 + 32,
        85, 48, 0,
        192, 144, 64);

    // Draw road pieces
    for (let i = 0; i < this.pieces.length; ++i) {

        this.pieces[i].draw(g);
    }
}
