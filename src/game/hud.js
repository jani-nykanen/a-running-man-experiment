/**
 * HUD
 * 
 * @author Jani Nykänen
 */

// Global constants
const HUD_GUIDE_TIME = 30.0;


// Constructor
var HUD = function () {

    const INITIAL_TIME_SECONDS = 60.0;
    const START_TIME = 60.0 * 4;

    // Distance
    this.dist = 0.0;
    // To checkpoint
    this.checkpointDist = 200.0;
    // Time
    this.time = INITIAL_TIME_SECONDS * 60.0;

    // Lives
    this.lives = 3;
    // Fuel
    this.fuel = 1.0;

    // Death activated
    this.deathActivated = false;
    // Death message timer
    this.deathMsgTimer = 0.0;
    // Death timer
    this.deathTimer = 0.0;

    // Start timer (3,2,1, GO)
    this.startTimer = START_TIME;
    // Guide timer
    this.guideTimer = HUD_GUIDE_TIME;
}


// Get distance string
HUD.prototype.getDistanceString = function (f, dec) {

    let s = "";
    if ((f | 0) < 1000 && dec) {

        let x = Math.floor(f * 10) / 10.0;
        s = String(x);
        if (x == (x  | 0))
            s += ".0";
    }
    else {

        s = String(f | 0);
    }

    return s + "m";
}


// Draw time & distance
HUD.prototype.drawTimeAndDistance = function (g, a) {

    let bmpText = a.bitmaps.tinyText;

    // Draw tiny text
    g.drawBitmapRegion(bmpText, 0, 0, 32, 8, 9, 1);
    g.drawBitmapRegion(bmpText, 0, 8, 32, 8, 64 - 16, 1);
    g.drawBitmapRegion(bmpText, 0, 16, 40, 8, 96 - 10, 1);

    let bmpFont = a.bitmaps.font;
    let bmpBig = a.bitmaps.fontBig;

    // Draw distance
    g.drawText(bmpFont, this.getDistanceString(this.dist, true), 26, 8, -1, 0, true);

    // Draw distance to checkpoint
    g.drawText(bmpFont, this.getDistanceString(this.checkpointDist, false), 96 + 8, 8, -1, 0, true);

    // Draw time
    g.drawText(bmpBig, String(Math.ceil(this.time / 60.0)), 64, 9, 0, 0, true);
}


// Draw lives
HUD.prototype.drawLives = function (g, a) {

    for (let i = 0; i < 3; ++i) {

        g.drawBitmapRegion(a.bitmaps.hud,
            (i + 1 > this.lives) * 16, 0,
            16, 16,
            1 + i * 16, 128 - 17);
    }
}


// Draw fuel
HUD.prototype.drawFuel = function (g, a) {

    // Draw fuel icon
    g.drawBitmapRegion(a.bitmaps.hud, 32, 0, 16, 16, 128 - 15, 128 - 17);

    // Draw background bar
    g.drawBitmapRegion(a.bitmaps.hud, 0, 32, 48, 16, 128 - 62, 128 - 18);

    // Draw bar
    let t = this.fuel * 47;
    let p = 48 + ((3.0 - (this.fuel / 0.33333) | 0) * 16);
    g.drawBitmapRegion(a.bitmaps.hud, 0, 16, (t | 0) + 1, 16, 128 - 62, 128 - 18);
    g.drawBitmapRegion(a.bitmaps.hud, 0, p, t | 0, 16, 128 - 62, 128 - 18);
}


// Draw start time
HUD.prototype.drawStartTime = function (g, a) {

    let frame = 4- (this.startTimer / 60.0) | 0;

    let x = 64-16;
    let y = 32;

    g.drawBitmapRegion(a.bitmaps.ready, frame*32, 0, 32, 32,
        x, y, Flip.None);
}


// Update
HUD.prototype.update = function (pl, checkpoint, gover, audio, a, tm) {

    const METRE = 3.0;
    const FUEL_DELTA_SPEED = 0.005;
    const DEATH_WAIT = 120;

    // Update distances
    this.dist += pl.speed.z * METRE * tm;
    this.checkpointDist = checkpoint.getDistance(pl) * METRE / 2.0 * tm;

    // Update start timer
    if (this.startTimer > 0.0) {

        let old = (this.startTimer / 60.0) | 0;
        this.startTimer -= 1.0 * tm;
        let n = (this.startTimer / 60.0) | 0;

        // Play beep if changed
        if(old != n) {

            audio.playSample(n == 0 ? a.audio.go : a.audio.ready, 0.60);
        }

        return;
    }
    // Update guide time
    else if(this.guideTimer > 0.0) {

        this.guideTimer -= 1.0 * tm;
    }

    // Update time
    if (!pl.dying)
        this.time -= 1.0 * tm;
    if (this.time <= 0.0) {

        // Kill player
        pl.die(2);

        this.time = 0.0;
    }

    // Update fuel
    let fuel = pl.fuel;
    if (fuel < this.fuel) {

        this.fuel -= FUEL_DELTA_SPEED * tm;
        if (this.fuel < fuel)
            this.fuel = fuel;
    }
    else if (fuel > this.fuel) {

        this.fuel += FUEL_DELTA_SPEED * tm;
        if (this.fuel > fuel)
            this.fuel = fuel;
    }

    // Set lives
    this.lives = pl.lives;

    // Check player death
    if (pl.dying && !this.deathActivated) {

        this.deathActivated = true;
    }

    // Update death timer
    if (this.deathActivated) {

        // Update message timer
        this.deathMsgTimer += 1.0 * tm;
    
        // Update death timer
        if(pl.canJump) {

            this.deathTimer += 1.0 * tm;
            if(this.deathTimer >= DEATH_WAIT) {

                gover.activate(this);
                return;
            }
        }
    }
}


// Draw guide
HUD.prototype.drawGuide = function(g, a) {

    const XOFF = 26;
    const YPOS = 24;
    const YOFF = 24;

    let bmp = a.bitmaps.guide;

    let t = this.guideTimer / HUD_GUIDE_TIME;

    let x1 = -24 + XOFF*t;
    let x2 = 128 - XOFF*t;
    
    // Left
    g.drawBitmapRegion(bmp, 0, 0, 24, 24, x1, YPOS, 0);
    g.drawBitmapRegion(bmp, 24, 0, 24, 24, x1, YPOS + YOFF, 0);
    g.drawBitmapRegion(bmp, 96, 0, 24, 24, x1, YPOS + YOFF*2, 0);

    // Right
    g.drawBitmapRegion(bmp, 48, 0, 24, 24, x2, YPOS, 0);
    g.drawBitmapRegion(bmp, 72, 0, 24, 24, x2, YPOS + YOFF, 0);

}


// Draw
HUD.prototype.draw = function (g, a) {

    // Draw time & distance textes
    this.drawTimeAndDistance(g, a);

    // Draw lives
    this.drawLives(g, a);

    // Draw fuel
    this.drawFuel(g, a);

    // Draw start text
    if (this.startTimer > 0.0) {

        this.drawStartTime(g, a);
    }

    // Draw guide
    if(this.guideTimer > 0.0) {

        this.drawGuide(g, a);
    }
}


// Draw death message
HUD.prototype.drawDeathMessage = function (g, a, pl) {

    const FLICKER_TIME = 60.0;
    const TEXT = [
        "OUT OF LOVE", "OUT OF FUEL",
        "TIME'S UP!"
    ];

    if (!pl.dying || !this.deathActivated) return;

    // Flicker
    if (this.deathMsgTimer < FLICKER_TIME
        && Math.floor(this.deathMsgTimer / 2) % 2 == 0)
        return;

    // Draw text
    g.drawText(a.bitmaps.font, TEXT[pl.deathType], 64, 32, -1, 0, true);
}


// Add time
HUD.prototype.addTime = function (sec) {

    this.time += sec * 60.0;
    if (this.time > 99.0 * 60)
        this.time = 99.0 * 60;
}
