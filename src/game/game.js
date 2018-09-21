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

    // Create game objects
    this.player = new Player(1.25);

    // Camera X
    this.camX = 0.0;
}
Game.prototype = Object.create(Scene.prototype);


// Update function
Game.prototype.update = function (tm) {

    // Update player & camera
    this.camX = this.player.update(this.vpad, this.camX, tm);

    // Update background
    this.bg.update(this.player.speed.z, tm);

    // Update road
    this.road.update(this.player.speed.z, tm);

}


// Rendering function
Game.prototype.draw = function (g) {

    const Y_TRANSLATION = 0.75;

    // Set translation
    g.setTranslation(-this.camX, Y_TRANSLATION, 0);

    // Draw background
    this.bg.draw(g, this.assets);

    // Draw road
    this.road.draw(g);

    // Post draw background
    this.bg.postDraw(g, this.assets);

    // Draw player
    this.player.draw(g, this.assets);
}
