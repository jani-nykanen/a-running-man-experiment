/**
 * Horizontally moving slime
 * 
 * @author Jani Nykänen
 */

// Global contants
let SPEED = 0.015;


 // Constructor
var HorizontalSlime = function(param) {

    Enemy.call(this);

    this.id = 1;
    this.width = 0.75;
    this.height = 0.75;

    // Movement limits
    this.left = param[0];
    this.right = param[1];

    this.dir = Math.random() < 0.5 ? 1 : -1;
    this.target.x = this.dir * SPEED;
}
HorizontalSlime.prototype = Object.create(Enemy.prototype);


// On update
HorizontalSlime.prototype.onUpdate = function(pl, tm) {

    // Set flipping flag
    this.flip = this.dir > 0 ? Flip.Horizontal : Flip.None;

    // If leaving the road
    if( (this.dir < 0 && this.pos.x < this.left) 
        || (this.dir > 0 && this.pos.x > this.right)) {

        this.dir *= -1;
        this.target.x = this.dir * SPEED;
    }
}


// Animate
HorizontalSlime.prototype.animate = function(tm) {

    const ANIM_SPEED = 8;

    this.spr.animate(this.id, 0, 3, ANIM_SPEED, tm);
}
