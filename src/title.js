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

        // Fade out music
        this.audio.fadeOutMusic(this.assets.audio.menu, 0.60, 1000.0);

        // Fade to the game scene
        t.global.trans.activate(2.0, Mode.In, function() {

            t.app.changeScene("game");
        });
        break;

    // Leaderboard
    case 1:
        
        t.global.trans.activate(2.0, Mode.In, function() {

            t.app.scenes.leaderboard.fetchScores();
            t.app.changeScene("leaderboard");
        });
        break;

    // Audio on/off
    case 2:
        t.audio.toggle(!t.audio.enabled);
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

            this.audio.playSample(this.assets.audio.start, 0.50);
            ++ this.phase;
        }
    }
    else {
        
        // Get audio state
        this.menu.text[2] = this.audio.enabled ? "AUDIO: ON" : "AUDIO: OFF";

        // Update menu
        this.menu.update(this.vpad, this.audio, this.assets);
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
        this.menu.draw(g, this.assets, 16, 64, 14, 
            this.global.trans.active && this.global.trans.mode == Mode.In,
            this.global.trans.timer);
    }
}


// On change
Title.prototype.onChange = function(scene) {

    if(scene != this.app.scenes.leaderboard) {
        
        this.audio.stopMusic();
        this.audio.fadeInMusic(this.assets.audio.menu, 0.60, 1000.0);
    }
}
