/**
 * A road generator
 * 
 * @author Jani Nykänen
 */

 
// Constructor
var Road = function () {

    const ROAD_STEP = 0.5;
    const ROAD_WIDTH = 1.5;
    const ROAD_COUNT = 32;
    const START_POS = 8.0;
    const DEC_COUNT = 32;

    // Road pieces
    this.pieces = new Array(ROAD_COUNT);
    // Create default road
    for (let i = 0; i < this.pieces.length; ++i) {

        this.pieces[i] = new RoadPiece(ROAD_WIDTH, ROAD_STEP);
        if (i < START_POS / ROAD_STEP) {

            this.pieces[i].createSelf(0, 0, i * ROAD_STEP);
        }
    }

    // Decorations
    this.decorations = new Array(DEC_COUNT);
    // Make sure they don't exist
    for(let i = 0; i < this.decorations.length; ++ i) {

        this.decorations[i] = new Decoration();
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

    // Decoration timer
    this.decTimer = 0.0;
}


// The name says it all
Road.prototype.getNextAvailableObject = function (arr) {

    for (let i = 0; i < arr.length; ++i) {

        if (!arr[i].exist)
            return i;
    }
    return 0;
}


// Create a new road piece
Road.prototype.createNewRoadPiece = function (x, z) {

    this.creationX = this.oldX + x;

    // Create a road piece
    let i = this.getNextAvailableObject(this.pieces);
    this.pieces[i].createSelf(this.oldX, this.creationX, z + this.startPos);

    this.oldX = this.creationX;
}


// Create a new decoration
Road.prototype.createDecoration = function(middle, z, dir) {

    const DIST_MIN = 1.5;
    const DIST_MAX = 3.5;

    let dist = Math.random() * (DIST_MAX - DIST_MIN) + DIST_MIN;

    let i = this.getNextAvailableObject(this.decorations);
    let x = middle + dist * dir;

    this.decorations[i].createSelf(x, 0.0, z + this.startPos, 0);
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


// Update decoration generator
Road.prototype.updateDecGenerator = function(z) {

    const WAIT_MIN = 2;
    const WAIT_MIN_UP = 5;
    const WAIT_MAX_BASE = 8;
    const DUAL_PROB = 0.25;

    -- this.decTimer;
    if(this.decTimer <= 0) {

        let count = Math.random() <= DUAL_PROB ? 2 : 1;
        let waitMax = WAIT_MAX_BASE * (count);
        let waitMin = WAIT_MIN + WAIT_MIN_UP * (count -1);

        for(let i = 0; i < count; ++ i) {

            let dir = count == 1 ? (Math.random() <= 0.5 ? 1 : -1) : (i == 0 ? 1 : -1);

            this.createDecoration(this.oldX, z, dir);
        }
        this.decTimer += Math.floor(Math.random()*(waitMax-waitMin) + waitMin);
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

            // Generate decorations, maybe
            this.updateDecGenerator(this.pieces[i].z);

            // Create a new road piece
            this.createNewRoadPiece(
                this.curvature * CURVATURE_FACTOR,
                this.pieces[i].z);
        }
    }

    // Update decorations
    for(let i = 0; i < this.decorations.length; ++ i) {

        this.decorations[i].update(globalSpeed, NEAR, tm);
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


// Draw decorations
Road.prototype.drawDecorations = function(obuf) {

    // Draw decorations
    for(let i = 0; i < this.decorations.length; ++ i) {

        if(this.decorations[i].exist) {

            obuf.addObject(this.decorations[i]);
        }
    }
}
