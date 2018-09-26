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
    this.checkpointDist = 1000.0;
    // Time
    this.time = 60.0 * 60.0;
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
    g.drawBitmapRegion(bmpText, 0, 16, 40, 8, 96 - 12, 1);

    let bmpFont = a.bitmaps.font;
    let bmpBig = a.bitmaps.fontBig;

    // Draw distance
    g.drawText(bmpFont, this.getDistanceString(this.dist, true), 24, 8, -1, 0, true);

    // Draw distance to checkpoint
    g.drawText(bmpFont, this.getDistanceString(this.checkpointDist, false), 96+8, 8, -1, 0, true);

    // Draw time
    g.drawText(bmpBig, String( (this.time/60.0) | 0), 64, 9, 0, 0, true);
}


// Update
HUD.prototype.update = function(pl, tm) {

    const METRE = 3.0;

    // Update distances
    this.dist += pl.speed.z * METRE * tm;
    this.checkpointDist -= pl.speed.z * METRE * tm;

    // Update time
    this.time -= 1.0 * tm;
}


// Draw
HUD.prototype.draw = function(g, a) {

    // Draw time & distance textes
    this.drawTimeAndDistance(g, a);
}
