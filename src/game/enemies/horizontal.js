/**
 * Horizontally moving slime
 * 
 * @author Jani Nykänen
 */

 // Constructor
var HorizontalSlime = function() {

    Enemy.call(this);

    this.id = 1;
    this.width = 0.75;
    this.height = 0.75;
}
HorizontalSlime.prototype = Object.create(Enemy.prototype);


// On update
HorizontalSlime.prototype.onUpdate = function(pl, tm) {

    // ...
}


// Animate
HorizontalSlime.prototype.animate = function(tm) {

    const ANIM_SPEED = 10;

    this.spr.animate(this.id, 0, 3, ANIM_SPEED, tm);
}
