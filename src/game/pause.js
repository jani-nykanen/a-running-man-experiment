/**
 * Pause menu
 * 
 * @author Jani Nykänen
 */


// Constructor
var Pause = function () {

    this.active = false;

    // Button text
    this.text = [
        "RESUME",
        "RESTART",
        "AUDIO: ON",
        "QUIT"
    ];

    // Cursor position
    this.cursor = 0;
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

    // Draw text
    for(let i = 0; i < this.text.length; ++ i) {

        g.drawText(a.bitmaps.font, 
            (this.cursor == i ? ">" : "") + this.text[i], 
            x + XPOS, y + Y_START + i*YOFF, 
            -1, 0, false);
    }
}


// Button event
Pause.prototype.buttonEvent = function(game) {

    switch(this.cursor) {

        // Resume
        case 0:
            this.active = false;
            break;

        // Restart
        case 1:
            game.reset();
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
Pause.prototype.update = function (vpad, game) {

    const DELTA = 0.1;

    if (!this.active) return;

    // Move cursor
    let dy = vpad.delta.y;
    let sy = vpad.stick.y;

    if(sy > DELTA && dy > DELTA)
        ++ this.cursor;

    else if(sy < -DELTA && dy < -DELTA)
        -- this.cursor;

    // Restrict
    if(this.cursor < 0) 
        this.cursor = this.text.length -1;
    else if(this.cursor >= this.text.length) 
        this.cursor = 0;

    // Check accept button
    if (vpad.buttons.confirm == State.Pressed
     || vpad.buttons.fire1 == State.Pressed) {

        this.buttonEvent(game);
    }
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
