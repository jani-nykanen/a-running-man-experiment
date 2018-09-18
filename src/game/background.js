/**
 * Background renderer
 * 
 * @author Jani Nykänen
 */


// Constructor
var Background = function () {

    const END_Z = 8.0;
    const STEP_COUNT = 8;

    // Cloud position
    this.cloudPos = 0.0;

    // Floor position
    this.floorPos = 0.0;
    // End z
    this.floorEnd = END_Z;

    // Step count
    this.stepCount = STEP_COUNT;
    // Floor step
    this.floorStep = END_Z / STEP_COUNT;
    // Floor "modulo"
    this.floorMod = 0;
}


// Draw "floor"
Background.prototype.drawFloor = function (g) {

    const START_Z = 1.0;

    // Draw floor lines
    let z = START_Z;
    g.setGlobalColor(85, 192, 32);

    let p, q;

    for(let i = 0; i < this.stepCount; ++ i) {

        if(i % 2 == this.floorMod) {
            
            z += this.floorStep;
            continue;
        }

        p = g.project(0.0, 0, z - this.floorPos);
        q = g.project(0.0, 0, z - this.floorPos + this.floorStep);
        z += this.floorStep;
        if(p == null || q == null) continue;

        g.fillRect(0, q.y, 128, p.y-q.y);
        
    }

    // Draw temp road
    // this.drawRoad(g);
}


// Draw a (temporary) road
Background.prototype.drawRoad = function(g) {

    const ROAD_WIDTH = 0.5;
    const NEAR = 1.0;

    let p1 = g.project(-ROAD_WIDTH, 0, this.floorEnd);
    let p2 = g.project(-ROAD_WIDTH, 0, NEAR);

    let q1 = g.project(ROAD_WIDTH, 0, this.floorEnd);
    let q2 = g.project(ROAD_WIDTH, 0, NEAR);

    // Set "gradient"
    g.setFloorRectGradient(72, 72+32, 85, 85, 85, 170, 170, 170);

    // Concrete
    g.setGlobalColor(170, 170, 170);
    g.drawFloorRect(-ROAD_WIDTH, -ROAD_WIDTH, 0, NEAR, 
        ROAD_WIDTH*2, this.floorEnd - NEAR);

    // Outlines
    g.setGlobalColor(0, 0, 0);
    g.drawLine(p1.x, p1.y, p2.x, p2.y);
    g.drawLine(q1.x, q1.y, q2.x, q2.y);
}


// Update
Background.prototype.update = function (globalSpeed, tm) {

    const CLOUD_SPEED = 0.1;

    // Update clouds
    this.cloudPos -= CLOUD_SPEED * tm;
    if (this.cloudPos <= -128.0) {

        this.cloudPos += 128.0;
    }

    // Update floor position
    this.floorPos += globalSpeed * tm;
    if(this.floorPos >= this.floorStep) {

        this.floorPos -= this.floorStep;
        this.floorMod = this.floorMod == 0 ? 1 : 0;
    }
}


// Draw
Background.prototype.draw = function (g, assets) {

    let a = assets;

    // Background color
    g.clearScreen(128, 255, 128);

    // Sky
    g.drawBitmap(a.bitmaps.sky, 0, 0, 0);

    // Clouds
    for (let i = 0; i < 2; ++i) {

        g.drawBitmap(a.bitmaps.clouds, this.cloudPos + i * 128, 0, 0);
    }

    // Mountains
    g.drawBitmap(a.bitmaps.mountains, 0, 32, 0);

    // Forest
    g.drawBitmap(a.bitmaps.forest, 0, 56, 0);

    // "Floor"
    this.drawFloor(g);

}
