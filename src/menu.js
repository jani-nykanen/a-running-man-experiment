/**
 * A generic menu
 * 
 * @author Jani Nykänen
 */


// Constructor
var Menu = function(text, cb, params) {

    // Text
    this.text = text;
    // Callback
    this.cb = cb;
    // Parameters for callback
    this.params = params;

    // Cursor position
    this.cursor = 0;
}


// Update
Menu.prototype.update = function(vpad, audio, a) {

    const DELTA = 0.1;
    
    let old = this.cursor;
    // Move cursor
    let dy = vpad.delta.y;
    let sy = vpad.stick.y;

    if(sy > DELTA && dy > DELTA)
        ++ this.cursor;

    else if(sy < -DELTA && dy < -DELTA)
        -- this.cursor;

    // Cursor moved, play sound effect
    if(old != this.cursor) {

        audio.playSample(a.audio.choose, 0.6);
    }

    // Restrict
    if(this.cursor < 0) 
        this.cursor = this.text.length -1;
    else if(this.cursor >= this.text.length) 
        this.cursor = 0;

    // Check accept button
    if (vpad.buttons.confirm == State.Pressed
        || vpad.buttons.fire1 == State.Pressed) {
   
        this.cb(this.cursor, this.params);
        audio.playSample(a.audio.select, 0.70);
    }
}


// Draw
Menu.prototype.draw = function(g, a, x, y, yoff, flicker, t) {

    // Draw text
    for(let i = 0; i < this.text.length; ++ i) {

        if(flicker && (
            i != this.cursor ||
            Math.floor(t/4) % 2 == 0
            )) continue;

        g.drawText(a.bitmaps.font, 
            (this.cursor == i ? ">" : "") + this.text[i], 
            x, y + i*yoff, 
            -1, 0, false);
    }
}
