/**
 * Enemy generator
 * 
 * @author Jani Nykänen
 */

// Global contants
let ENEMY_INTERVAL = 10;
let ENEMY_INTERVAL_VARY = 2;
let ENEMY_TIME_INITIAL = 15;


// Constructor
var EnemyGen = function() {

    const ENEMY_MAX = 32;

    // An array of enemies
    if(this.enemies == null)
        this.enemies = new Array(ENEMY_MAX);
    for(let i = 0; i < this.enemies.length; ++ i) {

        this.enemies[i] = new Enemy();
    }

    // Timer
    this.timer = ENEMY_TIME_INITIAL;    
}


// Get the next enemy index
EnemyGen.prototype.getNextEnemyIndex = function() {

    for(let i = 0; i < this.enemies.length; ++ i) {

        if(this.enemies[i].exist == false) {

            return i;
        }
    }
    return 0;
}


// Update timer
EnemyGen.prototype.updateTimer = function() {

    if(-- this.timer <= 0) {

        // Create enemy
        // ...

        this.timer += ENEMY_INTERVAL + (Math.random()*ENEMY_INTERVAL_VARY) | 0;
    }
}


// Update
EnemyGen.prototype.update = function(pl, near, tm) {
    
    // Update enemies
    for(let i = 0; i < this.enemies.length; ++ i) {

        this.enemies[i].update(pl, near, tm);
    }
}


// Draw
EnemyGen.prototype.draw = function(g, a) {

    // Draw enemies
    for(let i = 0; i < this.enemies.length; ++ i) {

        this.enemies[i].draw(g, a);
    }
} 
