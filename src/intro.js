/**
 * Intro scene
 * 
 * @author Jani Nykänen
 */

// Global contants
let Intro_FLICKER_MAX = 60.0;


// Constructor
var Intro = function(app) {
    
    const TIME = 120.0;

    Scene.call(this,[app, "intro"]);

    this.timer = TIME;

    // Set fading
    this.global.trans.activate(1.0, Mode.Out, null);
}
Intro.prototype = Object.create(Scene.prototype);


// Update function
Intro.prototype.update = function(tm) {

    let trans = this.global.trans;
    if(trans.active) return;

    // Update timer
    this.timer -= 1.0 * tm;
    if(this.timer <= 0.0 || this.vpad.input.anyKeyPressed) {
        
        trans.activate(2.0, Mode.In, function() {

            appRef.changeScene("title");
        });
    }
    
}


// Rendering function
Intro.prototype.draw = function(g) {

    g.clearScreen(0, 0, 0);

    // Draw "game by" text
    g.drawBitmap(this.assets.bitmaps.creator, 0, 0, 0);
}
