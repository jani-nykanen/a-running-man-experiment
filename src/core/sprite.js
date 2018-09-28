/**
 * An animated sprite
 * 
 * @author Jani Nykänen
 */


// Constructor
var Sprite = function (w, h) {

    // Dimensions
    this.width = w;
    this.height = h;

    this.frame = 0;
    this.row = 0;
    this.count = 0.0;
}


// Animate
Sprite.prototype.animate = function (row, start, end, speed, tm) {

    // Nothing to animate
    if (start == end) {

        this.count = 0;
        this.frame = start;
        this.row = row;
        return;
    }

    // Swap row
    if (this.row != row) {

        this.count = 0;
        this.frame = end > start ? start : end;
        this.row = row;
    }

    // If outside the animation interval
    if (start < end && this.frame < start) {

        this.frame = start;
    }
    else if (end < start && this.frame < end) {

        this.frame = end;
    }

    // Animate
    this.count += 1.0 * tm;
    if (this.count > speed) {

        if (start < end) {

            if (++this.frame > end) {

                this.frame = start;
            }
        }
        else {

            if (--this.frame < end) {

                this.frame = start;
            }
        }

        this.count -= speed;
    }
}


// Draw
Sprite.prototype.draw = function (g, bmp, dx, dy, flip) {

    g.drawBitmapRegion(bmp, this.width * this.frame,
        this.height * this.row, this.width, this.height, dx, dy, flip);
}


// Draw to 3D space
Sprite.prototype.draw3D = function(g, bmp, x, y, z, w, h, flip) {

    g.drawFlat3D(bmp, this.width * this.frame,
        this.height * this.row, this.width, this.height,
        x, y, z, w, h, 12, flip, true);
}
