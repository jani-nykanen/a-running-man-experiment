/**
 * Transition
 * 
 * @author Jani Nykänen
 */

// Global contants
let TRANSITION_TIME = 60.0;

// Transition mode
var Mode = {
    In: 0,
    Out: 1
};


// Constructor
var Transition = function() {

    this.speed = 1.0;
    this.timer = 0.0;
    this.mode = Mode.In;
    this.cb = null;
    this.active = false;
}


// Activate
Transition.prototype.activate = function(speed, mode, cb) {

    this.speed = speed;
    this.mode = mode;
    this.cb =  cb;
    this.timer = TRANSITION_TIME;

    this.active = true;
}


// Update
Transition.prototype.update = function(tm) {

    if(!this.active) return;

    // Update timer
    this.timer -= this.speed * tm;
    if(this.timer <= 0.0) {

        if(this.mode == Mode.In) {

            // Set mode to out
            this.mode = Mode.Out;
            this.timer = TRANSITION_TIME;

            // Call callback function
            if(this.cb != null)
                this.cb();
        }
        else {

            this.active = false;
        }
    }
}


// Draw
Transition.prototype.draw = function(g) {

    const PHASE_DIVIDER = 8;
    const DELTA = 0.001;

    if(!this.active) return;

    // Fill with transparent black
    let alpha = Math.ceil(this.timer / TRANSITION_TIME * PHASE_DIVIDER) / PHASE_DIVIDER;
    if(this.mode == Mode.In) {

        alpha = 1.0 - alpha; 
    }
    if(alpha <= DELTA) return;

    g.setGlobalColor(0, 0, 0, alpha);
    g.fillRect(0, 0, 128, 128);
    g.setGlobalColor();
}
