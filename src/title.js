/**
 * Title screen scene
 * 
 * @author Jani Nykänen
 */

// Global contants
let TITLE_FLICKER_MAX = 60.0;


// Constructor
var Title = function(app) {
    
    const TEXT = [
        "PLAY GAME",
        "LEADERBOARD",
        "AUDIO: ON"
    ];

    Scene.call(this,[app, "title"]);

    // Flicker timer
    this.flicker = TITLE_FLICKER_MAX;

    // Phase
    this.phase = 0;

    // Menu
    this.menu = new Menu(TEXT,  function(cursor, arr) {

        arr[0].confirmEvent(cursor, arr[0]);
    }, [this]);
}
Title.prototype = Object.create(Scene.prototype);


// Handle confirm event
Title.prototype.confirmEvent = function(cursor, t) {

    switch(cursor) {

    // Play
    case 0:
        t.global.trans.activate(2.0, Mode.In, function() {

            t.app.changeScene("game");
        });
        break;

    // Leaderboard
    case 1:
        
        t.global.trans.activate(2.0, Mode.In, function() {

            t.app.changeScene("leaderboard");
        });
        break;

    // Audio on
    case 2:
        break;

    default:
        break;
    }
}


// Update function
Title.prototype.update = function(tm) {

    if(this.global.trans.active) return;

    // Flicker
    this.flicker += 1.0 * tm;
    if(this.flicker >= TITLE_FLICKER_MAX)
        this.flicker -= TITLE_FLICKER_MAX;

    // Input events
    if(this.phase == 0) {
         // Confirm pressed
        if(this.vpad.buttons.confirm == State.Pressed) {

            ++ this.phase;
        }
    }
    else {
        
        this.menu.update(this.vpad);
    }
}


// Rendering function
Title.prototype.draw = function(g) {

    const PRESS_ENTER_X = 64;
    const PRESS_ENTER_Y = 88;

    g.clearScreen(85, 170, 255);

    // Draw logo
    g.drawBitmap(this.assets.bitmaps.logo, 0, 0, 0);

    if(this.phase == 0) {

        // Draw "Press enter"
        if(this.flicker < TITLE_FLICKER_MAX/2) {

            g.drawText(this.assets.bitmaps.font, "PRESS ENTER", 
                PRESS_ENTER_X, PRESS_ENTER_Y, -1, 0, true);
        }
    }
    else {

        // Draw menu
        this.menu.draw(g, this.assets, 16, 64, 14);
    }
}
