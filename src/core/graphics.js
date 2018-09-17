/**
 * Graphics manager
 * 
 * @author Jani Nykänen
 */


// Global flipping flags
var Flip = {
    None: 0,
    Horizontal: 1,
    Vertical: 2,
    Both: 3
};


// Private helper functions
let getColorString = function (r, g, b, a) {

    if (a == null) a = 1.0;

    return "rgba("
        + String(r | 0) + ","
        + String(g | 0) + ","
        + String(b | 0) + ","
        + String(a) + ")";
}


// Constructor
var Graphics = function (canvasName) {

    // Get canvas & context
    this.canvas = document.getElementById(canvasName);
    this.ctx = this.canvas.getContext("2d");

    // Global color
    this.globalColor = getColorString(255, 255, 255);

    // Transformations
    this.transf = new Transformation();
}


// Center the canvas
Graphics.prototype.centerCanvas = function (w, h) {

    let ratio = this.canvas.width / this.canvas.height;
    let winRatio = w / h;

    // If horizontal
    let width, height, x, y;
    if (winRatio >= ratio) {

        width = h * ratio;
        height = h;

        x = w / 2 - width / 2;
        y = 0;
    }
    // If vertical
    else {

        height = w / ratio;
        width = w;

        x = 0;
        y = h / 2 - height / 2;
    }

    this.canvas.style.height = String(height | 0) + "px";
    this.canvas.style.width = String(width | 0) + "px";
    this.canvas.style.top = String(y | 0) + "px";
    this.canvas.style.left = String(x | 0) + "px";
}


// Clear the screen with a color
Graphics.prototype.clearScreen = function (r, g, b) {

    let c = this.ctx;

    c.fillStyle = getColorString(r, g, b);
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
}


// Draw a bitmap
Graphics.prototype.drawBitmap = function (bmp, x, y, flip) {

    this.drawBitmapRegion(bmp, 0, 0, bmp.width, bmp.height, x, y, flip);
}


// Draw a bitmap region
Graphics.prototype.drawBitmapRegion = function (bmp, sx, sy, sw, sh, dx, dy, flip) {

    sw = sw | 0;
    sh = sh | 0;

    flip = flip | Flip.None;
    let c = this.ctx;

    // If flipping, save the current transformations
    // state
    if (flip != Flip.None) {
        c.save();
    }

    // Flip horizontally
    if ((flip & Flip.Horizontal) != 0) {

        c.translate(sw, 0);
        c.scale(-1, 1);
    }
    // Flip vertically
    if ((flip & Flip.Vertical) != 0) {

        c.translate(0, sh);
        c.scale(1, -1);
    }

    c.drawImage(bmp, sx | 0, sy | 0, sw, sh, dx | 0, dy | 0, sw, sh);

    // ... and restore the old
    if (flip != Flip.None) {
        c.restore();
    }
}


// Draw text
Graphics.prototype.drawText = function (bmp, text, dx, dy, xoff, yoff, center) {

    let cw = bmp.width / 16;
    let ch = cw;
    let len = text.length;
    let x = dx;
    let y = dy;
    let c = 0;

    let sx = 0;
    let sy = 0;

    // Center the text
    if (center) {

        dx -= ((len) / 2.0 * (cw + xoff));
        x = dx;
    }

    // Draw every character
    for (let i = 0; i < len; ++i) {

        c = text.charCodeAt(i);
        if (c == '\n') {

            x = dx;
            y += yoff + ch;
            continue;
        }

        sx = c % 16;
        sy = (c / 16) | 0;

        this.drawBitmapRegion(bmp, sx * cw, sy * ch, cw, ch,
            x, y,
            Flip.NONE);

        x += cw + xoff;
    }
}


// Set global color for primitive rendering (here rectangles)
Graphics.prototype.setGlobalColor = function (r, g, b, a) {

    let c = this.ctx;

    this.globalColor = getColorString(r, g, b, a);
    c.fillStyle = this.globalColor;
}


// Draw a filled rectangle
Graphics.prototype.fillRect = function (x, y, w, h) {

    let c = this.ctx;
    c.fillRect(x | 0, y | 0, w | 0, h  | 0);
}