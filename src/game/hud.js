/**
 * HUD
 * 
 * @author Jani Nykänen
 */


// Constructor
var HUD = function() {

    // Distance
    this.dist = 0.0;
    // To checkpoint
    this.checkpointDist = 500.0;
    // Time
    this.time = 60.0 * 60.0;

    // Lives
    this.lives = 3;
    // Fuel
    this.fuel = 1.0;
}


// Get distance string
HUD.prototype.getDistanceString = function(f, dec) {

    let s = "";
    if( (f|0) < 1000 && dec) {

        let x = Math.floor(f * 10) / 10.0;
        s = String(x);
        if(x == (x | 0)) 
            s += ".0";
    }
    else {

        s = String(f | 0);
    }

    return s + "m";
}


// Draw time & distance
HUD.prototype.drawTimeAndDistance = function(g, a) {

    let bmpText = a.bitmaps.tinyText;

    // Draw tiny text
    g.drawBitmapRegion(bmpText, 0, 0, 32, 8, 9, 1);
    g.drawBitmapRegion(bmpText, 0, 8, 32, 8, 64 - 16, 1);
    g.drawBitmapRegion(bmpText, 0, 16, 40, 8, 96 - 10, 1);

    let bmpFont = a.bitmaps.font;
    let bmpBig = a.bitmaps.fontBig;

    // Draw distance
    g.drawText(bmpFont, this.getDistanceString(this.dist, true), 26, 8, -1, 0, true);

    // Draw distance to checkpoint
    g.drawText(bmpFont, this.getDistanceString(this.checkpointDist, false), 96+8, 8, -1, 0, true);

    // Draw time
    g.drawText(bmpBig, String( Math.ceil(this.time/60.0) ), 64, 9, 0, 0, true);
}


// Draw lives
HUD.prototype.drawLives = function(g, a) {

    for(let i = 0; i < this.lives; ++ i) {

        g.drawBitmapRegion(a.bitmaps.hud, 0, 0, 16, 16, 
            1+i*16, 128-17);
    }
}


// Draw fuel
HUD.prototype.drawFuel = function(g, a) {

    // Draw fuel icon
    g.drawBitmapRegion(a.bitmaps.hud, 32, 0, 16, 16, 128-15, 128-17);

    // Draw background bar
    g.drawBitmapRegion(a.bitmaps.hud, 0, 32, 48, 16, 128-62, 128-18);

    // Draw bar
    let t = this.fuel * 47;
    g.drawBitmapRegion(a.bitmaps.hud, 0, 48, (t | 0) +1, 16, 128-62, 128-18);
    g.drawBitmapRegion(a.bitmaps.hud, 0, 16, t | 0, 16, 128-62, 128-18);
}


// Update
HUD.prototype.update = function(pl, tm) {

    const METRE = 3.0;
    const FUEL_PER_METRE = 0.015;

    // Update distances
    this.dist += pl.speed.z * METRE * tm;
    this.checkpointDist -= pl.speed.z * METRE * tm;

    // Update time
    this.time -= 1.0 * tm;

    // Update fuel
    this.fuel -= (pl.speed.z / METRE) * FUEL_PER_METRE * tm;
}


// Draw
HUD.prototype.draw = function(g, a) {

    // Draw time & distance textes
    this.drawTimeAndDistance(g, a);

    // Draw lives
    this.drawLives(g, a);

    // Draw fuel
    this.drawFuel(g, a);
}
