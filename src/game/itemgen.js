/**
 * Item generator
 * 
 * @author Jani Nykänen
 */


// Constructor
var ItemGen = function() {

    const ITEM_MAX = 32;
    const INITIAL_ITEM_TIME = 60.0;

    // Item array
    this.items = new Array(ITEM_MAX);
    for(let i = 0; i < this.items.length; ++ i) {

        this.items[i] = new Item();
    }

    // Timer
    this.itemTimer = INITIAL_ITEM_TIME;
}


// Create an item
ItemGen.prototype.createItem = function(x, y, z) {

    // Get item
    let index = 0;
    for(let i = 0; i < this.items.length; ++ i) {

        if(!this.items[i].exist && !this.items[i].dying) {

            index = i;
            break;
        }
    }

    // Create
    this.items[index].createSelf(x, y, z, 0);
}


// Update
ItemGen.prototype.update = function(pl, near, x, z, w, tm) {

    const ITEM_INTERVAL = 60.0;
    const ITEM_Y = -0.15;
    const VARIATION_MOD = 0.5;
    let variation = w / 2 * VARIATION_MOD;

    let speed = pl.speed.z / 0.060;

    // Update generator
    this.itemTimer -= speed * tm;
    if(this.itemTimer <= 0.0) {

        this.createItem(x + (Math.random()*2-1)*variation, ITEM_Y, z)
        this.itemTimer += ITEM_INTERVAL;
    }

    // Update items
    for(let i = 0; i < this.items.length; ++ i) {

        this.items[i].update(pl, near, tm);
    }
}


// Draw
ItemGen.prototype.draw = function(obuf) {

    // Draw items
    for(let i = 0; i < this.items.length; ++ i) {

        // this.items[i].draw(g, a);
        obuf.addObject(this.items[i]);
    }
}
