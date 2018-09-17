/**
 * Game scene
 * 
 * @author Jani Nykänen
 */


// Constructor
var Game = function (app) {

    Scene.call(this, [app, "game"]);

    // Create components
    this.bg = new Background();
}
Game.prototype = Object.create(Scene.prototype);


// Update function
Game.prototype.update = function (tm) {

    // Update background
    this.bg.update(tm);
}


// Rendering function
Game.prototype.draw = function (g) {

    g.clearScreen(170, 170, 170);

    // Draw background
    this.bg.draw(g, this.assets);
}
