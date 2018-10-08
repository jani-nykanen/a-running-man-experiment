/**
 * Item object
 * 
 * @author Jani Nykänen
 */


// Constructor
var Item = function () {

    const DEFAULT_SIZE = 0.4;
    const DEATH_MAX = 20.0;

    this.id = 0;
    this.exist = false;
    this.pos = { x: 0, y: 0, z: 0 };

    // Dimensions
    this.w = DEFAULT_SIZE;
    this.h = DEFAULT_SIZE;

    // Render size
    this.rw = DEFAULT_SIZE;
    this.rh = DEFAULT_SIZE;

    // Sprite
    this.spr = new Sprite(24, 24);

    // Wave
    this.wave = 0.0;

    // Is dying
    this.dying = false;
    this.deathTimer = 0.0;
    this.maxDeathTime = DEATH_MAX;
}


// Create
Item.prototype.createSelf = function (x, y, z, id) {

    const DEFAULT_SIZE = 0.4;
    const FUEL_MUL = 1.20;

    this.pos.x = x;
    this.pos.y = y;
    this.pos.z = z;
    this.id = id;

    // Size for fuel
    if(this.id == 2) {

        this.w = DEFAULT_SIZE* FUEL_MUL;
        this.h = DEFAULT_SIZE*FUEL_MUL;
    }
    else {

        this.w = DEFAULT_SIZE;
        this.h = DEFAULT_SIZE;
    }

    this.spr.row = this.id;

    this.exist = true;
    this.dying = false;
}


// Player collision
Item.prototype.playerCollision = function (pl, audio, a) {

    const PL_WIDTH = 0.0;
    const DEPTH = 0.2;
    const FUEL_UP = 0.50;

    if(!this.exist) return;

    if(pl.pos.x + PL_WIDTH > this.pos.x-this.w/2 
    && pl.pos.x - PL_WIDTH < this.pos.x+this.w/2
    && pl.pos.y > this.pos.y-this.h/2
    && pl.pos.z > this.pos.z-DEPTH - pl.speed.z
    && pl.pos.z < this.pos.z+DEPTH + pl.speed.z) {

        this.exist = false;
        this.dying = true;
        this.deathTimer = this.maxDeathTime;

        let track = null;
        let vol = 0.0;

        // Effect
        switch(this.id) {

        // Gem
        case 0:
            pl.boost();
            track = a.audio.gem;
            vol = 0.60;
            break;

        // Heart
        case 1:
            pl.addLife();
            track = a.audio.heal;
            vol = 1.00;
            break;

        // Fuel
        case 2:
            pl.addFuel(FUEL_UP);
            track = a.audio.fuel;
            vol = 0.60;
            break;

        default: 
            break;
        }
    
        audio.playSample(track, vol);
    }
}


// Update
Item.prototype.update = function (pl, near, audio, a, tm) {

    const WAVE_SPEED = 0.1;

    if (!this.exist) {

        // Update death timer
        if(this.dying) {

            this.deathTimer -= 1.0 * tm;
            if(this.deathTimer <= 0.0)
                this.dying = false;

            // Move
            this.pos.z -= pl.speed.z * tm;

            // Set animation row to one bigger
            this.spr.animate(this.id*2 +1, 0, 4,
                this.maxDeathTime / 5, tm);
        }
        
        return;
    }

    // Move
    this.pos.z -= pl.speed.z * tm;
    if (this.pos.z < near) {

        this.exist = false;
    }

    // Animate
    const ANIM_LENGTH = [4, 5, 7];
    const ANIM_SPEED = [8, 6, 10];
    this.spr.animate(this.id*2, 0, ANIM_LENGTH[this.id], ANIM_SPEED[this.id], tm);

    // Update wave
    this.wave += WAVE_SPEED * tm;

    // Player collision
    this.playerCollision(pl, audio, a);
}


// Draw
Item.prototype.draw = function (g, a) {

    const SHADOW_WIDTH = 0.5;
    const SHADOW_HEIGHT = 0.30;
    const AMPLITUDE = 0.05;
    const DEATH_SCALE = 1.25;

    let scale = 1.0;

    if (!this.exist) {

        if(this.dying) {

            // Set dying alpha
            let t = this.deathTimer / this.maxDeathTime;
            scale += (1.0 - t) * DEATH_SCALE;
        }
        else
            return;
    }

    // Draw shadow
    g.drawFlat3D(a.bitmaps.shadow, 0, 0, 24, 24, this.pos.x, 0.0, this.pos.z,
        SHADOW_WIDTH, SHADOW_HEIGHT, 4, Flip.None);

    // Draw sprite
    this.spr.draw3D(g, a.bitmaps.items, this.pos.x,
        this.pos.y + Math.sin(this.wave) * AMPLITUDE,
        this.pos.z - this.rh * (scale-1),
        this.rw*scale, this.rh*scale,
        12,
        Flip.None,
        !this.dying);

    if(this.dying) {

        g.setGlobalAlpha(1.0);
    }
}
