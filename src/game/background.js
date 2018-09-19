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

    // "Floor"
    this.drawFloor(g);
}


// "Post" draw
Background.prototype.postDraw = function(g, assets) {

    const Y_OFF = 15;

    let a = assets;

    // Get camera X translation
    let tx = g.transf.tr.x;

    // Sky
    g.drawBitmap(a.bitmaps.sky, 0, 0, 0);

    // Clouds
    for (let i = 0; i < 2; ++i) {

        g.drawBitmap(a.bitmaps.clouds, this.cloudPos + i * 128, 0, 0);
    }

    // Calculate mountain & forest positions
    let mountainX = tx / 0.5;
    let forestX = tx / 0.25;

    // Mountains
    for(let i = -1; i <= 1; ++ i) {

        g.drawBitmap(a.bitmaps.mountains, 
            mountainX  + i*128, 
            16 + Y_OFF, 0);
    } 

    // Forest
    for(let i = -1; i <= 1; ++ i) {
    
        g.drawBitmap(a.bitmaps.forest, 
            forestX + i*128, 
            40 + Y_OFF, 0);
    }
}