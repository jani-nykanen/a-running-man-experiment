/**
 * Title screen scene
 * 
 * @author Jani Nykänen
 */

// Global contants
let TITLE_FLICKER_MAX = 60.0;


// Constructor
var Title = function(app) {
    
    Scene.call(this,[app, "title"]);

    // Flicker timer
    this.flicker = 0.0;
}
Title.prototype = Object.create(Scene.prototype);


// Update function
Title.prototype.update = function(tm) {

    if(this.global.trans.active) return;

    // Flicker
    this.flicker += 1.0 * tm;
    if(this.flicker >= TITLE_FLICKER_MAX)
        this.flicker -= TITLE_FLICKER_MAX;

    // Confirm pressed
    if(this.vpad.buttons.confirm == State.Pressed) {

        // Change to game
        this.global.trans.activate(2.0, Mode.In, function() {

            appRef.changeScene("game");
        });
    }
}


// Rendering function
Title.prototype.draw = function(g) {

    const PRESS_ENTER_X = 64;
    const PRESS_ENTER_Y = 88;

    g.clearScreen(85, 170, 255);

    // Draw logo
    g.drawBitmap(this.assets.bitmaps.logo, 0, 0, 0);


    // Draw "Press enter"
    if(this.flicker >= TITLE_FLICKER_MAX/2) {

        g.drawText(this.assets.bitmaps.font, "PRESS ENTER", 
            PRESS_ENTER_X, PRESS_ENTER_Y, -1, 0, true);
    }
}
