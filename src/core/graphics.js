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

    const NEAR = 0.05;
    const FAR = 100.0;

    // Get canvas & context
    this.canvas = document.getElementById(canvasName);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    // Global color
    this.globalColor = getColorString(255, 255, 255);

    // Transformations
    this.transf = new Transformation();

    // Set near/far
    this.near = NEAR;
    this.far = FAR;

    // Rectangle floor gradient
    this.gradient = {
        begin: 0, end: 0,
        enabled: false,
        col1: { r: 0, g: 0, b: 0 },
        col2: { r: 0, g: 0, b: 0 }
    };
}


// Set gradient color value
Graphics.prototype.setGradientColorValue = function(y) {

    let g = this.gradient;

    if(y <= g.begin) this.setGlobalColor(g.col1.r, g.col1.g, g.col1.b);
    else if(y >= g.end) this.setGlobalColor(g.col2.r, g.col2.g, g.col2.b);
    else {

        // Check "position"
        let t = (y-g.begin) / (g.end-g.begin);

        this.setGlobalColor(
            g.col1.r*(1-t) + g.col2.r*t,
            g.col1.g*(1-t) + g.col2.g*t,
            g.col1.b*(1-t) + g.col2.b*t
        )
    }
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


// Draw a scaled bitmap
Graphics.prototype.drawScaledBitmap = function (bmp, dx, dy, dw, dh,  flip) {

    this.drawScaledBitmapRegion(bmp, 0, 0, bmp.width, bmp.height, dx, dy, dw, dh, flip);
}


// Draw a bitmap region
Graphics.prototype.drawBitmapRegion = function (bmp, sx, sy, sw, sh, dx, dy, flip) {

    this.drawScaledBitmapRegion(bmp, sx, sy, sw, sh, dx, dy, sw, sh, flip);
}


// Draw a scaled bitmap region
Graphics.prototype.drawScaledBitmapRegion = function (bmp, sx, sy, sw, sh, dx, dy, dw, dh, flip) {

    if(dw <= 0 || dh <= 0) return;

    sw = sw | 0;
    sh = sh | 0;

    dw = dw | 0;
    dh = dh | 0;

    flip = flip | Flip.None;
    let c = this.ctx;

    // If flipping, save the current transformations
    // state
    if (flip != Flip.None) {
        c.save();
    }

    // Flip horizontally
    if ((flip & Flip.Horizontal) != 0) {

        c.translate(dw, 0);
        c.scale(-1, 1);
        dx *= -1;
    }
    // Flip vertically
    if ((flip & Flip.Vertical) != 0) {

        c.translate(0, dh);
        c.scale(1, -1);
        dy *= -1;
    }

    c.drawImage(bmp, sx | 0, sy | 0, sw, sh, dx | 0, dy | 0, dw | 0, dh | 0);

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

    if(r == null)
        this.setGlobalColor(255, 255, 255);

    let c = this.ctx;
    a = a || 1.0;

    this.globalColor = getColorString(r, g, b, a);
    c.fillStyle = this.globalColor;
}


// Draw a filled rectangle
Graphics.prototype.fillRect = function (x, y, w, h) {

    let c = this.ctx;
    c.fillRect(x | 0, y | 0, w | 0, h | 0);
}


// Draw a line
Graphics.prototype.drawLine = function (x1, y1, x2, y2) {

    x1 = x1 | 0;
    x2 = x2 | 0;
    y1 = y1 | 0;
    y2 = y2 | 0;

    let dx = Math.abs(x2 - x1) | 0;
    let sx = x1 < x2 ? 1 : -1;
    let dy = Math.abs(y2 - y1) | 0;
    let sy = y1 < y2 ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2, e2;

    while (true) {

        if (!(y1 >= this.canvas.width  || y1 < 0 ||
            x1 >= this.canvas.height || x1 < 0)) {

            this.fillRect(x1, y1, 1, 1);
        }

        if (x1 == x2 && y1 == y2) break;
        e2 = err;
        if (e2 > -dx) { err -= dy; x1 += sx; }
        if (e2 < dy) { err += dx; y1 += sy; }
    }
}


// Project a point to the screen
Graphics.prototype.project = function (x, y, z) {

    return this.transf.project(x, y, z, this.near, this.far,
        this.canvas.width, this.canvas.height);
}


// Draw a floor rectangle
Graphics.prototype.drawFloorRect = function (x1, x2, y, z, width, depth, outlines) {

    const DELTA = 0.5;
    if (depth < DELTA) return;

    // Get corner points
    let p1 = this.project(x1, y, z);
    let p2 = this.project(x2, y, z + depth);
    let q1 = this.project(x1 + width, y, z);
    let q2 = this.project(x2 + width, y, z + depth);

    if (p1 == null || p2 == null || q1 == null || q2 == null)
        return;

    let k1 = (p2.x - p1.x) / (p2.y - p1.y);
    let k2 = (q2.x - q1.x) / (q2.y - q1.y);

    let sx = p2.x;
    let ex = q2.x;

    for (let i = p2.y; i <= Math.min(this.canvas.height, p1.y); ++i) {

        if(this.gradient.enabled)
            this.setGradientColorValue(i);

        this.fillRect(sx, i, ex - sx + 1, 1);

        sx += k1;
        ex += k2;
    }

    // Draw side outlines
    if(outlines) {

        this.setGlobalColor(0, 0, 0);
        this.drawLine(p1.x, p1.y, p2.x, p2.y);
        this.drawLine(q1.x, q1.y, q2.x, q2.y);
    }
}


// Draw a flat object in 3D space
Graphics.prototype.drawFlat3D = function(bmp, sx, sy, sw, sh, x, y, z, w, h, yoff, flip, borders) {

    let hoff = h * (yoff / bmp.height);

    let p1 = this.project(x-w/2, y-h+hoff, z);
    let p2 = this.project(x+w/2, y+hoff, z);
    if(p1 == null || p2 == null) return;

    let dx = p1.x;
    let dy = p1.y;
    let dw = p2.x - p1.x;
    let dh = p2.y - p1.y;

    // Draw black outlines
    if(borders) {

        let hjump = bmp.width / 2;
        for(let px = -1; px <= 1; ++ px) {

            for(let py = -1; py <= 1; ++ py) {

                if( (Math.abs(px)) != (Math.abs(py)) ) {

                    this.drawScaledBitmapRegion(bmp, sx+hjump, sy, sw, sh, 
                        dx+px, dy+py, dw, dh, flip);
                }
            }
        }
    }

    this.drawScaledBitmapRegion(bmp, sx, sy, sw, sh, dx, dy, dw, dh, flip);
}


// Set floor rectangle gradient
Graphics.prototype.setFloorRectGradient = function (begin, end,
    r1, g1, b1, r2, g2, b2) {

    this.gradient.enabled = begin != null && begin != false;
    if (begin == null || begin == false) return;

    this.gradient.begin = begin;
    this.gradient.end = end;

    this.gradient.col1 = { r: r1, g: g1, b: b1 };
    this.gradient.col2 = { r: r2, g: g2, b: b2 };
}


// Set translation
Graphics.prototype.setTranslation = function(x, y, z) {

    if(x == null) {

        x = 0;
        y = 0;
        z = 0;
    }

    this.transf.tr.x = x;
    this.transf.tr.y = y;
    this.transf.tr.z = z;
}


// Set global alpha
Graphics.prototype.setGlobalAlpha = function(a) {

    if(a == null) a = 1.0;
    this.ctx.globalAlpha = a;
}