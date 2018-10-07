/**
 * Following slime
 * 
 * @author Jani Nykänen
 */


// Global contants
let FOLLOW_SPEED = 0.02;


 // Constructor
var FollowingSlime = function(param) {

    Enemy.call(this);

    this.id = 4;
    this.width = 0.75;
    this.height = 0.75;

    this.acc.x = 0.0040;

    // Movement limits
    this.left = param[0];
    this.right = param[1];

    this.dir = Math.random() < 0.5 ? 1 : -1;
    this.target.x = this.dir * FOLLOW_SPEED;

    this.wave = 0.0;
}
FollowingSlime.prototype = Object.create(Enemy.prototype);


// On update
FollowingSlime.prototype.onUpdate = function(pl, audio, a, tm) {

    const WAVE_SPEED = 0.05;
    const AMPLITUDE = 0.30;

    // Update wave
    this.wave += WAVE_SPEED * tm;

    // Set y pos
    this.pos.y = -Math.abs(Math.sin(this.wave) * AMPLITUDE);

    // Set target speed
    this.dir = pl.pos.x < this.pos.x ? -1 : 1;
    this.target.x = this.dir * FOLLOW_SPEED;

    // Set flipping flag
    this.flip = this.dir > 0 ? Flip.Horizontal : Flip.None;
}


// Animate
FollowingSlime.prototype.animate = function(tm) {

    const ANIM_SPEED = 6;

    this.spr.animate(this.id, 0, 3, ANIM_SPEED, tm);
}
