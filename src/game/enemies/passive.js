/**
 * Passive slime
 * 
 * @author Jani Nykänen
 */


// Constructor
var PassiveSlime = function() {

    Enemy.call();

    this.id = 0;
}
PassiveSlime.prototype = Object.create(Enemy.prototype);


// On update
PassiveSlime.prototype.onUpdate = function(pl, tm) {

    // ...
}


// Animate
PassiveSlime.prototype.animate = function(tm) {

    const ANIM_SPEED = 8;

    this.spr.animate(this.id, 0, 3, ANIM_SPEED, tm);
}
