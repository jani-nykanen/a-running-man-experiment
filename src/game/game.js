/**
 * Game scene
 * 
 * @author Jani Nykänen
 */


// Constructor
var Game = function (app) {

    Scene.call(this, [app, "game"]);

    const OBUF_SIZE = 64;

    // Create components
    this.bg = new Background();
    this.road = new Road();
    this.hud = new HUD();

    // Create game objects
    this.player = new Player(1.25);
    this.checkpoint = new Checkpoint();
    this.obuf = new ObjectBuffer(OBUF_SIZE);

    // Set checkpoint
    this.checkpoint.createSelf(0.0, 0.0, 8.0);

    // Camera X
    this.camX = 0.0;
}
Game.prototype = Object.create(Scene.prototype);


// Update function
Game.prototype.update = function (tm) {

    const NEAR = 0.5;
    const FAR = 8.0;

    // Update player & camera
    this.camX = this.player.update(this.vpad, this.camX, tm);

    // Update road
    this.road.update(this.player, tm);

    // Update background
    this.bg.update(this.player.speed.z, tm);

    // Update checkpoint
    this.checkpoint.update(this.player, NEAR, FAR, tm);

    // Update HUD
    this.hud.update(this.player, tm);

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

    // Post draw road
    this.road.drawDecorations(this.obuf);

    // Push player to the buffer
    this.obuf.addObject(this.player);

    // Push checkpoint to the buffer
    if(this.checkpoint.drawSelf)
        this.obuf.addObject(this.checkpoint);

    // Draw buffer
    this.obuf.sortByDepth();
    this.obuf.draw(g, this.assets);

    // Draw HUD
    this.hud.draw(g, this.assets);
}
