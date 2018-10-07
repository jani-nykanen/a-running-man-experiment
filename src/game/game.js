/**
 * Game scene
 * 
 * @author Jani Nykänen
 */


// Constructor
var Game = function (app) {

    Scene.call(this, [app, "game"]);

    // (Re)set content
    this.reset();

}
Game.prototype = Object.create(Scene.prototype);


// Reset
Game.prototype.reset = function() {

    const OBUF_SIZE = 64;
    const CHECKPOINT_INTERVAL = 16.667 * 2 * 1;
    const INITIAL_CHECKPOINT_POS = 16.667 * 2 * 2;

    // Create components
    this.bg = new Background();
    this.road = new Road();
    this.hud = new HUD();
    this.pause = new Pause(this);
    this.gover = new GameOver(this);

    // Create game objects
    this.player = new Player(1.25);
    this.checkpoint = new Checkpoint();
    this.obuf = new ObjectBuffer(OBUF_SIZE);

    // Set checkpoint
    this.checkpoint.createSelf(0.0, 0.0, 
        INITIAL_CHECKPOINT_POS,
        CHECKPOINT_INTERVAL);
    this.checkpoint.pos.z += this.player.pos.z;

    // Camera X
    this.camX = 0.0;

    // Update once
    this.updatedOnce = false;
}


// Update function
Game.prototype.update = function (tm) {

    const NEAR = 0.5;
    const FAR = 8.0;

    // Skip, if fading
    if(this.global.trans.active && this.updatedOnce) return;
    this.updatedOnce = true;

    // Check game over
    if(this.gover.active) {

        this.gover.update(this.vpad, this);
        return;
    }

    // Check pause
    if(this.pause.active) {

        this.pause.update(this.vpad, this.audio, this.assets);
        return;
    }
    else if(!this.player.dying
        && this.vpad.buttons.confirm == State.Pressed) {

        this.pause.active = true;
        this.audio.playSample(this.assets.audio.pause, 0.80);
        return;
    }

    // Update player & camera (if not start timer active)
    if(this.hud.startTimer <= 60.0)
        this.camX = this.player.update(this.vpad, this.camX, this.audio, this.assets, tm);

    // Update road
    this.road.update(this.player, this.checkpoint, this.audio, this.assets, tm);

    // Update background
    this.bg.update(this.player.speed.z, tm);

    // Update checkpoint
    this.checkpoint.update(this.player, this.hud, NEAR, FAR, this.audio, this.assets, tm);

    // Update HUD
    if(!this.global.trans.active) {

        this.hud.update(this.player, this.checkpoint, this.gover, 
            this.audio, this.assets, tm);
    }
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
    if(this.checkpoint.ready)
        this.obuf.addObject(this.checkpoint);

    // Draw buffer
    this.obuf.sortByDepth();
    this.obuf.draw(g, this.assets);

    if(!this.gover.active) {

        // Draw HUD
        this.hud.draw(g, this.assets);

        // Draw HUD death message
        this.hud.drawDeathMessage(g, this.assets, this.player);

        // Draw possible checkpoint message
        this.checkpoint.drawMessage(g, this.assets);

        // Draw pause box
        this.pause.draw(g, this.assets);
    }
    else {

        // Draw Game Over! screen
        this.gover.draw(g, this.assets);
    }

}


// On change
Game.prototype.onChange = function() {

    // Reset
    this.reset();
}
