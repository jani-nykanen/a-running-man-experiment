/**
 * Pause menu
 * 
 * @author Jani Nykänen
 */


// Constructor
var Pause = function (game) {

    this.active = false;

    // Button text
    this.text = [
        "RESUME",
        "RESTART",
        "AUDIO: ON",
        "QUIT"
    ];

    // Menu
    this.menu = new Menu(this.text,function(cursor, arr) {

        arr[0].buttonEvent(cursor, arr[1]);
    }, [this, game]);
}


// Draw box
Pause.prototype.drawBox = function (g, a, w, h) {

    const Y_START = 6;
    const YOFF = 14;
    const XPOS = 6;

    let x = 64 - w / 2;
    let y = 64 - h / 2;

    // Draw background
    g.setGlobalColor(255, 255, 255);
    g.fillRect(x - 1, y - 1, w + 2, h + 2);

    g.setGlobalColor(0, 0, 0);
    g.fillRect(x, y, w, h);

    // Draw menu
    this.menu.draw(g, a, x + XPOS, y + Y_START, YOFF);
}


// Button event
Pause.prototype.buttonEvent = function(cursor, game) {

    switch(cursor) {

        // Resume
        case 0:
            this.active = false;
            break;

        // Restart
        case 1:
            game.global.trans.activate(2.0, Mode.In, function() {
                game.reset();
            });
            break;
        // Audio
        case 2:
        // Exit
        case 3:
            // ...
            break;

        
    }
}


// Update
Pause.prototype.update = function (vpad) {

    if (!this.active) return;

    // Update menu
    this.menu.update(vpad);
}


// Draw
Pause.prototype.draw = function (g, a) {

    if (!this.active) return;

    g.setGlobalColor(0, 0, 0, 0.5);
    g.fillRect(0, 0, 128, 128);
    g.setGlobalColor();

    // Draw box
    this.drawBox(g, a, 96, 64);
}
