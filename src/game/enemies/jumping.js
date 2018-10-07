/**
 * Jumping slime
 * 
 * @author Jani Nykänen
 */

let SLIME_JUMP_WAIT = 30.0;


// Constructor
var JumpingSlime = function() {

    Enemy.call(this);

    this.id = 2;
    this.width = 0.75;
    this.height = 0.75;

    // Jump timer
    this.jumpTimer = Math.random() * SLIME_JUMP_WAIT;
}
JumpingSlime.prototype = Object.create(Enemy.prototype);


// On update
JumpingSlime.prototype.onUpdate = function(pl, audio, a, tm) {

    const GRAVITY = 0.025;
    const JUMP_MIN = 0.050;
    const JUMP_MAX = 0.075;

    this.target.y = GRAVITY;


    // Floor collision
    if(this.speed.y > 0.0 && this.pos.y > 0.0) {

        this.pos.y = 0.0;
        this.speed.y = 0.0;
        
        if(this.jumpTimer <= 0.0) {

            this.jumpTimer += SLIME_JUMP_WAIT;
        }
    }

    // Update timer
    if(this.jumpTimer > 0.0) {

        this.jumpTimer -= 1.0 * tm;
        // Jump
        if(this.jumpTimer <= 0.0) {

            this.speed.y = -(Math.random() * (JUMP_MAX-JUMP_MIN) + JUMP_MIN);

            // Play sound
            audio.playSample(a.audio.jump2, 0.55);
        }
    }
}


// Animate
JumpingSlime.prototype.animate = function(tm) {

    
    this.spr.row = this.id;

    if(this.jumpTimer > 0.0)
        this.spr.frame = 0;

    else {

        if(this.speed.y < 0.0)
            this.spr.frame = 1;
        else
            this.spr.frame = 2;
    }
}
