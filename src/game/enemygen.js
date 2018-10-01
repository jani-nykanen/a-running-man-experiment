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


// Create an enemy
EnemyGen.prototype.createEnemy = function(x, y, z) {

    const MAX_ID = 2;

    let i = this.getNextEnemyIndex();
    let id = (Math.random() * MAX_ID) | 0;

    this.enemies[i] = new ([PassiveSlime, HorizontalSlime][id]) ();

    this.enemies[i].createSelf(x, y, z);

}


// Update timer
EnemyGen.prototype.updateTimer = function(x, z, w) {

    const WIDTH_MOD = 0.5;

    if(-- this.timer <= 0) {

        // Create enemy
        this.createEnemy(x + (Math.random()*2-1) * (w*WIDTH_MOD/2), 
            0.0, z);

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
EnemyGen.prototype.draw = function(obuf) {

    // Draw enemies
    for(let i = 0; i < this.enemies.length; ++ i) {

        obuf.addObject(this.enemies[i]);
    }
} 
