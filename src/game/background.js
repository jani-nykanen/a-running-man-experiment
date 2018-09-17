/**
 * Background renderer
 * 
 * @author Jani Nykänen
 */


// Constructor
var Background = function () {

    // ...
}


// Update
Background.prototype.update = function (tm) {

    // ...
}


// Draw
Background.prototype.draw = function (g, assets) {

    let a = assets;

    // Background color
    g.clearScreen(128, 255, 128);

    // Sky
    g.drawBitmap(a.bitmaps.sky, 0, 0, 0);

    // Mountains
    g.drawBitmap(a.bitmaps.mountains, 0, 24, 0);

    // Forest
    g.drawBitmap(a.bitmaps.forest, 0, 48, 0);

}
