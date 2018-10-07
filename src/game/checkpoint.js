/**
 * Checkpoint
 * 
 * @author Jani Nykänen
 */


// Constructor
var Checkpoint = function () {

    const WIDTH = 2.0;
    const HEIGHT = WIDTH * 0.66;

    this.width = WIDTH;
    this.height = HEIGHT;

    this.pos = { x: 0, y: 0, z: 0 };

    this.exist = false;
    this.ready = false;

    this.interval = 0.0;
    this.triggered = false;

    // Message timer for "CHECKPOINT!" text
    this.messageTimer = 0.0;
}


// Create
Checkpoint.prototype.createSelf = function (x, y, z, interval) {

    this.pos.x = x;
    this.pos.y = y;
    this.pos.z = z;

    this.exist = true;
    this.ready = false;
    this.triggered = false;

    this.interval = z;
    this.initialInterval = interval;

    this.messageTimer = 0.0;
}


// Update
Checkpoint.prototype.update = function (pl, hud, near, far, audio, a, tm) {

    const TIME_BONUS = 20.0;
    const MESSAGE_TIME = 120.0;

    if(!this.exist) return;

    // Update message timer if necessary
    if(this.messageTimer > 0.0)
        this.messageTimer -= 1.0 * tm;

    // If player death, disable message
    if(pl.dying)
        this.messageTimer = 0.0;

    // If too far away, do not draw
    this.ready = this.pos.z < far;

    // Move
    this.pos.z -= pl.speed.z * tm;

    // Trigger event
    if(!this.triggered && this.pos.z <= pl.pos.z) {

        pl.addPhase();

        hud.addTime(TIME_BONUS);
        this.interval += this.initialInterval;
        this.triggered = true; 

        // Play sound
        audio.playSample(a.audio.go, 0.60);
    }

    // If near enough, move forward
    if(this.pos.z < near) {

        this.pos.z += this.interval;
        this.ready = false;
        this.triggered = false;
        this.messageTimer = MESSAGE_TIME;
    }
}


// Draw
Checkpoint.prototype.draw = function (g, a) {

    if (!this.exist || !this.ready) return;

    // Draw sprite
    g.drawFlat3D(a.bitmaps.checkpoint, 0, 0, 64, 48,
        this.pos.x, this.pos.y, this.pos.z, this.width, this.height,
        0.0, Flip.None, true);
}


// Draw message
Checkpoint.prototype.drawMessage = function(g, a) {

    const FLICKER_TIME = 90.0;

    if(!this.exist || this.messageTimer <= 0.0)
        return;

    // "Flicker"
    if(this.messageTimer >= FLICKER_TIME
        && Math.floor(this.messageTimer/2) % 2 == 0)
            return;

    // Draw text
    g.drawText(a.bitmaps.font, "CHECKPOINT!", 64, 32, -1, 0, true);
}


// Get distance
Checkpoint.prototype.getDistance = function(pl) {

    let d = this.pos.z - pl.pos.z;
    if(this.pos.z <= pl.pos.z) {

        d = this.interval -  (pl.pos.z - this.pos.z);
    }
    return d;
}
