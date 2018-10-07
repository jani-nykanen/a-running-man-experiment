/**
 * Flying slime
 * 
 * @author Jani Nykänen
 */


// Global contants
let FLYING_SPEED = 0.0125;


 // Constructor
var FlyingSlime = function(param) {

    Enemy.call(this);

    this.id = 3;
    this.width = 0.75;
    this.height = 0.75;

    // Movement limits
    this.left = param[0];
    this.right = param[1];

    this.acc.x = 0.001;

    this.dir = Math.random() < 0.5 ? 1 : -1;
    this.target.x = this.dir * FLYING_SPEED;

    this.initialY = -0.30;
    this.wave = 0.0;
}
FlyingSlime.prototype = Object.create(Enemy.prototype);


// On create
FlyingSlime.prototype.onCreate = function() {

    this.pos.y = this.initialY;
}


// On update
FlyingSlime.prototype.onUpdate = function(pl, audio, a, tm) {

    const WAVE_SPEED = 0.05;
    const AMPLITUDE = 0.1;

    // Set flipping flag
    this.flip = this.dir > 0 ? Flip.Horizontal : Flip.None;

    // Update wave
    this.wave += WAVE_SPEED * tm;

    // Set y
    this.pos.y = this.initialY + Math.sin(this.wave) * AMPLITUDE;

    // If leaving the road
    if( (this.dir < 0 && this.pos.x < this.left) 
        || (this.dir > 0 && this.pos.x > this.right)) {

        this.dir *= -1;
        this.target.x = this.dir * FLYING_SPEED;
    }
}


// Animate
FlyingSlime.prototype.animate = function(tm) {

    const ANIM_SPEED = 4;

    this.spr.animate(this.id, 0, 3, ANIM_SPEED, tm);
}
