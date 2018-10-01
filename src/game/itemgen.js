/**
 * Item generator
 * 
 * @author Jani Nykänen
 */

// Global constants
let HEART_INTERVAL = 10;
let HEART_INTERVAL_VARY = 2;
let FUEL_INTERVAL = 10;
let FUEL_INTERVAL_VARY = 2;
let SKIP_PROB_MIN = 2;
let SKIP_PROB_MAX = 6;


// Constructor
var ItemGen = function() {

    const ITEM_MAX = 32;
    const INITIAL_ITEM_TIME = 10.0;

    // Item array
    if(this.items == null)
        this.items = new Array(ITEM_MAX);
    for(let i = 0; i < this.items.length; ++ i) {

        this.items[i] = new Item();
    }

    // Timer
    this.itemTimer = INITIAL_ITEM_TIME;
    // Heart timer
    this.heartTimer = HEART_INTERVAL + 
        ( (Math.random()*2-1) | 0 ) * HEART_INTERVAL_VARY;
    // Fuel timer
    this.fuelTimer = FUEL_INTERVAL + 
        ( (Math.random()*2-1) | 0 ) * FUEL_INTERVAL_VARY;

    // Skip probability
    this.skipProb = SKIP_PROB_MIN;
}


// Create an item
ItemGen.prototype.createItem = function(x, y, z, pl) {

    // Get item
    let index = 0;
    for(let i = 0; i < this.items.length; ++ i) {

        if(!this.items[i].exist && !this.items[i].dying) {

            index = i;
            break;
        }
    }

    let id = 0;
    // Heart
    if(pl.lives < pl.maxLives && -- this.heartTimer <= 0) {

        id = 1; 

        this.heartTimer = HEART_INTERVAL + 
            ( (Math.random()*2-1) | 0 ) * HEART_INTERVAL_VARY;
    }
    // Fuel
    else if(-- this.fuelTimer <= 0) {

        id = 2;

        this.fuelTimer = FUEL_INTERVAL + 
            ( (Math.random()*2-1) | 0 ) * FUEL_INTERVAL_VARY;
    }
    // Gem
    if(id == 0) {

        // Skip
        if(Math.random() <= 1.0 / this.skipProb) {

            if(this.skipProb < SKIP_PROB_MAX)
                ++ this.skipProb;

            return;
        }
        else {

            this.skipProb = SKIP_PROB_MIN;
        }
    }

    // Create
    this.items[index].createSelf(x, y, z, id);
}


// Update timer
ItemGen.prototype.updateTimer = function(x, z, w, pl) {

    const ITEM_INTERVAL = 6;
    const ITEM_Y = -0.10;
    const VARIATION_MOD = 0.5;

    let variation = w / 2 * VARIATION_MOD;

    if(-- this.itemTimer <= 0) {

        this.createItem(x + (Math.random()*2-1)*variation, ITEM_Y, z, pl)
        this.itemTimer += ITEM_INTERVAL;

        return true;
    }
    return false;
}


// Update
ItemGen.prototype.update = function(pl, near, tm) {

    // Update items
    for(let i = 0; i < this.items.length; ++ i) {

        this.items[i].update(pl, near, tm);
    }
}


// Draw
ItemGen.prototype.draw = function(obuf) {

    // Draw items
    for(let i = 0; i < this.items.length; ++ i) {

        obuf.addObject(this.items[i]);
    }
}
