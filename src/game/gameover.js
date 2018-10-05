/**
 * Game over screen
 * 
 * @author Jani Nykänen
 */


// Constructor
var GameOver = function(game) {

    const TEXT = [
        "SUBMIT",
        "PLAY AGAIN",
        "QUIT"
    ];

    // Is active
    this.active = false;

    // Distance string & valye
    this.distStr = "";
    this.dist = 0;

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
        break;

    // Play again
    case 1:
        game.global.trans.activate(2.0, Mode.In, function() {
            game.reset();
        });
        break;

    // Quit
    case 2:
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

    // Get distance info
    this.distStr = hud.getDistanceString(hud.dist, true);
}


// Update
GameOver.prototype.update = function(vpad, game, tm) {

    // Update menu
    this.menu.update(vpad);
}


// Draw
GameOver.prototype.draw = function(g, a) {

    const BOX_HEIGHT = 80;
    const BOX_WIDTH = 96;

    const GAME_OVER_Y = 2;
    const MENU_Y = 36;
    const MENU_X = - 48;
    const Y_OFF = 14;

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
