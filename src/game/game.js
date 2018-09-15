/**
 * Game scene
 * 
 * @author Jani Nykänen
 */


// Constructor
var Game = function(app) {

    Scene.call(this,[app, "game"]);

    this.wave = 0.0;

}
Game.prototype = Object.create(Scene.prototype);


// Update function
Game.prototype.update = function(tm) {

    // ...
    this.wave += 0.05 * tm;
}


// Rendering function
Game.prototype.draw = function(g) {

    g.clearScreen(170, 170, 170);
    g.drawText(this.assets.bitmaps.font, "Hello world!", 
        64, 16 + (Math.sin(this.wave) * 8) | 0, 
        0, 0, true);

    let a = 0.5 + 0.5 * Math.sin(this.wave);
    g.setGlobalColor(255, 0, 0, a);
    g.fillRect(16,64,32,32);

    g.setGlobalColor(0, 0, 255, 1.0 - a);
    g.fillRect(32,80,32,32);
}
