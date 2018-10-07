/**
 * Game over screen
 * 
 * @author Jani Nykänen
 */

// Global contants
const NAME_MAX_LENGTH = 7;


// Constructor
var GameOver = function(game) {

    const TEXT = [
        "SUBMIT",
        "PLAY AGAIN",
        "QUIT"
    ];

    // Is active
    this.active = false;
    // "Phase"
    this.phase = 0;

    // Distance string & valye
    this.distStr = "";
    this.dist = 0;

    // Name string
    this.name = "";

    // Menu
    this.menu = new Menu(TEXT, function(cursor, arr) {

        arr[0].confirmEvent(cursor, arr[1]);
    }, [this, game]);
}


// Handle confirm event
GameOver.prototype.confirmEvent = function(cursor, game) {

    switch(cursor) {

    // Submit
    case 0:
        ++ this.phase;
        break;

    // Play again
    case 1:
        game.global.trans.activate(2.0, Mode.In, function() {
            game.reset();
        });
        break;

    // Quit
    case 2:
        game.global.trans.activate(2.0, Mode.In, function() {
            game.app.changeScene("title");
        });
        break;

    default:
        break;
    }
}


// Draw a box
GameOver.prototype.drawBox = function (g, w, h) {

    let x = 64 - w / 2;
    let y = 64 - h / 2;

    // Draw background
    g.setGlobalColor(255, 255, 255);
    g.fillRect(x - 2, y - 2, w + 4, h + 4);

    g.setGlobalColor(0, 0, 0);
    g.fillRect(x - 1, y - 1, w + 2, h + 2);

    g.setGlobalColor(85, 85, 85);
    g.fillRect(x, y, w, h);
    
}


// Activate
GameOver.prototype.activate = function(hud) {

    this.active = true;
    this.phase = 0;

    // Get distance info
    this.distStr = hud.getDistanceString(hud.dist, true);
}


// Get character input
GameOver.prototype.getCharInput = function(vpad) {
    
    if(this.name.length < NAME_MAX_LENGTH) {

        // From 0 to Z
        for(let i = 48; i <= 90; ++ i) {

            // Skip between 0 and A
            if(i > 57 && i < 65) continue;

            // Check if pressed
            if(vpad.input.keyStates[i] == State.Pressed) {

                this.name += String.fromCharCode(i);
                break;
            }
        }
    }

    // Check backspace
    if(vpad.input.getKey(8) == State.Pressed 
        && this.name.length > 0) {

        this.name = this.name.substr(0, this.name.length -1);
    }
}


// Update
GameOver.prototype.update = function(vpad, game) {

    // "Base"
    if(this.phase == 0) {

        // Cancel
        if(vpad.buttons.cancel == State.Pressed) {

            game.global.trans.activate(2.0, Mode.In, function() {
                game.reset();
            });
            return;
        }

        // Update menu
        this.menu.update(vpad, game.audio, game.assets);
    }
    // "Input"
    else if(this.phase == 1) {

        // Check escape
        if(vpad.buttons.cancel == State.Pressed) {

            this.phase = 0;
        }
        // Otherwise get char input
        else {

            this.getCharInput(vpad);
        }

        // If accepted
        if(vpad.buttons.confirm == State.Pressed 
            && this.name.length > 0) {

            // Go to the leaderboards scene
            game.app.changeScene("leaderboard");

            // Send score
            game.app.scenes.leaderboard.sendScore(this.name, 
                game.hud.dist);
        }
    }
}


// Draw base aka phase 0
GameOver.prototype.drawBase = function(g, a) {

    const GAME_OVER_Y = 2;
    const MENU_Y = 36;
    const MENU_X = - 48;
    const Y_OFF = 14;

    const BOX_HEIGHT = 80;
    const BOX_WIDTH = 96;

    // Draw background box
    this.drawBox(g, BOX_WIDTH, BOX_HEIGHT);

    // Draw title
    let x = 64;
    let y = 64 - BOX_HEIGHT/2 + GAME_OVER_Y;
    g.drawText(a.bitmaps.font, "GAME OVER!", x, y, -1, 0, true);

    // Draw distance
    g.drawBitmapRegion(a.bitmaps.tinyText, 0, 0, 32, 8, x-16, y + 12);
    g.drawText(a.bitmaps.font, this.distStr, x, y+20, -1, 0, true);

    // Draw menu
    this.menu.draw(g, a, x + MENU_X, y + MENU_Y, Y_OFF);
}


// Draw input box aka phase 1
GameOver.prototype.drawInputBox = function(g, a) {

    const TITLE_Y = 2;
    const YOFF = 14;
    const XOFF = 10;

    const BOX_HEIGHT = 32;
    const BOX_WIDTH = 80;

    // Draw background box
    this.drawBox(g, BOX_WIDTH, BOX_HEIGHT);

    // Draw title
    let x = 64;
    let y = 64 - BOX_HEIGHT/2 + TITLE_Y;
    g.drawText(a.bitmaps.font, "YOUR NAME:", x, y, -1, 0, true);

    // Draw name input
    let s = this.name.length < NAME_MAX_LENGTH ? this.name + "_" : this.name;
    g.drawText(a.bitmaps.font, s, 
        x-BOX_WIDTH/2 + XOFF, y + YOFF, 
        -1, 0, false);
}


// Draw
GameOver.prototype.draw = function(g, a) {

    if(this.phase == 0)
        this.drawBase (g, a);
    else
        this.drawInputBox (g, a);
}
