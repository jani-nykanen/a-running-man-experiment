/**
 * Game scene
 * 
 * @author Jani Nykänen
 */


// Constructor
var Game = function (app) {

    Scene.call(this, [app, "game"]);

    this.wave = 0.0;

    this.pos = { x: 64, y: 64 };
}
Game.prototype = Object.create(Scene.prototype);


// Update function
Game.prototype.update = function (tm) {

    // Update wave
    this.wave += 0.05 * tm;

    // Update pos
    this.pos.x += this.vpad.stick.x * tm;
    this.pos.y += this.vpad.stick.y * tm;
}


// Rendering function
Game.prototype.draw = function (g) {

    // A key pressed
    if (this.vpad.buttons.fire1 == State.Pressed) {

        g.clearScreen(0, 255, 0);
    }
    else {

        g.clearScreen(170, 170, 170);
    }
    
    g.drawText(this.assets.bitmaps.font, "Hello world!",
        64, 16 + (Math.sin(this.wave) * 8) | 0,
        0, 0, true);

    let a = 0.5 + 0.5 * Math.sin(this.wave);
    g.setGlobalColor(255, 0, 0, a);
    g.fillRect(16, 64, 32, 32);

    g.setGlobalColor(0, 0, 255, 1.0 - a);
    g.fillRect(32, 80, 32, 32);

    g.setGlobalColor(255, 255, 255, 1.0);
    g.fillRect(this.pos.x-4, this.pos.y-4, 8, 8);
}
