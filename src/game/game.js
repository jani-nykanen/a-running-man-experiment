/**
 * Game scene
 * 
 * @author Jani Nykänen
 */


// Constructor
var Game = function (app) {

    Scene.call(this, [app, "game"]);

    const INITIAL_GLOBAL_SPEED = 0.05;
    
    // Create components
    this.bg = new Background();
    this.road = new Road();

    // Global speed
    this.globalSpeed = INITIAL_GLOBAL_SPEED;
}
Game.prototype = Object.create(Scene.prototype);


// Update function
Game.prototype.update = function (tm) {

    // Update background
    this.bg.update(this.globalSpeed, tm);

    // Update road
    this.road.update(this.globalSpeed, tm);
}


// Rendering function
Game.prototype.draw = function (g) {

    const Y_TRANSLATION = 0.75;

    // Set translation
    g.setTranslation(0, Y_TRANSLATION, 0);

    // Draw background
    this.bg.draw(g, this.assets);

    // Draw road
    this.road.draw(g);
}
