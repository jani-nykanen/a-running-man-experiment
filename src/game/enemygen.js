/**
 * Enemy generator
 * 
 * @author Jani Nykänen
 */

// Global contants
let ENEMY_INTERVAL = 7;
let ENEMY_INTERVAL_VARY = 3;
let ENEMY_TIME_INITIAL = 15;
let ENEMY_SKIP_PROB_MIN = 2;
let ENEMY_SKIP_PROB_MAX = 6;

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

    // Skip probability
    this.skipProb = ENEMY_SKIP_PROB_MIN;
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
EnemyGen.prototype.createEnemy = function(x, y, z, middle, w) {

    const MAX_ID = 5;

    // Check if skip
    if(Math.random() <= 1.0 / this.skipProb) {

        if(this.skipProb < ENEMY_SKIP_PROB_MAX)
            ++ this.skipProb;

        return;
    }
    else {

        -- this.skipProb ;
        if(this.skipProb < ENEMY_SKIP_PROB_MIN)
            this.skipProb = ENEMY_SKIP_PROB_MIN;
    }

    let i = this.getNextEnemyIndex();
    let id = (Math.random() * MAX_ID) | 0;

    // Determine parameters
    let b = [x - w/2, x + w/2];
    let params = [ null, b, null, b, b];

    // Create enemy
    this.enemies[i] = new ([
        PassiveSlime, HorizontalSlime, JumpingSlime, 
        FlyingSlime, FollowingSlime,
    
    ][id]) (params[id]);

    this.enemies[i].createSelf(x, y, z);

}


// Update timer
EnemyGen.prototype.updateTimer = function(x, z, w) {

    const WIDTH_MOD = 0.625;

    if(-- this.timer <= 0) {

        // Create enemy
        this.createEnemy(x + (Math.random()*2-1) * (w*WIDTH_MOD/2), 
            0.0, z, x, w);

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
