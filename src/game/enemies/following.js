/**
 * Following slime
 * 
 * @author Jani Nykänen
 */


// Global contants
let FOLLOW_SPEED = 0.015;


 // Constructor
var FollowingSlime = function(param) {

    Enemy.call(this);

    this.id = 4;
    this.width = 0.75;
    this.height = 0.75;

    // Movement limits
    this.left = param[0];
    this.right = param[1];

    this.dir = Math.random() < 0.5 ? 1 : -1;
    this.target.x = this.dir * FOLLOW_SPEED;
}
FollowingSlime.prototype = Object.create(Enemy.prototype);


// On update
FollowingSlime.prototype.onUpdate = function(pl, tm) {

    // Set flipping flag
    this.flip = this.dir > 0 ? Flip.Horizontal : Flip.None;

    // If leaving the road
    if( (this.dir < 0 && this.pos.x < this.left) 
        || (this.dir > 0 && this.pos.x > this.right)) {

        this.dir *= -1;
        this.target.x = this.dir * FOLLOW_SPEED;
    }
}


// Animate
FollowingSlime.prototype.animate = function(tm) {

    const ANIM_SPEED = 6;

    this.spr.animate(this.id, 0, 3, ANIM_SPEED, tm);
}
