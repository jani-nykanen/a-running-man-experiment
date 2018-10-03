/**
 * Big slime
 * 
 * @author Jani Nykänen
 */


// Constructor
var BigSlime = function() {

    Enemy.call(this);

    this.id = 5;
    this.width = 0.75;
    this.height = 0.75;
    
    this.shadowWidth = 1.5;
    this.hitBox.w = 0.75;
    this.hitBox.h = 0.40;
}
BigSlime.prototype = Object.create(Enemy.prototype);


// On update
BigSlime.prototype.onUpdate = function(pl, tm) {

    // ...
}


// Animate
BigSlime.prototype.animate = function(tm) {

    const ANIM_SPEED = 10;

    this.spr.animate(this.id, 0, 3, ANIM_SPEED, tm);
}
