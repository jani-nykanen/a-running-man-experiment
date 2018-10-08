/**
 * Intro scene
 * 
 * @author Jani Nykänen
 */

// Global contants
let INTRO_FLICKER_MAX = 60.0;
let INTRO_TIME = 120.0;


// Constructor
var Intro = function(app) {
    
    Scene.call(this,[app, "intro"]);

    this.timer = INTRO_TIME;

    // Set fading
    this.global.trans.activate(1.0, Mode.Out, null);

    // Phase
    this.phase = 0.0;
}
Intro.prototype = Object.create(Scene.prototype);


// Update function
Intro.prototype.update = function(tm) {

    let trans = this.global.trans;
    if(trans.active) return;

    // Update timer
    this.timer -= 1.0 * tm;
    if(this.timer <= 0.0 || this.vpad.input.anyKeyPressed) {
        
        if(this.phase == 0) {

            trans.activate(2.0, Mode.In, function() {

                appRef.changeScene("intro");
            });
        }
        else {

            trans.activate(2.0, Mode.In, function() {

                appRef.changeScene("title");
            });
        }
    }
    
}


// Rendering function
Intro.prototype.draw = function(g) {

    g.clearScreen(0, 0, 0);

    // Draw "game by" text
    g.drawBitmapRegion(this.assets.bitmaps.creator, 
        this.phase*128, 0, 128, 128, 0, 0, 0);
}


// On change
Intro.prototype.onChange = function() {

    ++ this.phase;
    this.timer = INTRO_TIME;
}
