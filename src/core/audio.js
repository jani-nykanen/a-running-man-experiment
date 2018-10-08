/**
 * Audio routines
 * 
 * @author Jani Nykänen
 */

// Constructor
var Audio = function() {

    this.enabled = true;

    // Volume
    this.sampleVol = 1.0;
    this.musicVol = 1.0;

    // Music ID
    this.musicID = null;
    // Music sound
    this.musicSound = null;
    // Volume "cache"
    this.volCache = 0.0;
}


// Toggle audio
Audio.prototype.toggle = function(state) {

    let oldState = state;
    this.enabled = state;
    
    if(!state) {

        if(this.musicSound != null && this.musicID != null)
            this.musicSound.volume(0.0, this.musicID);
    }
    else {

        if(this.musicSound != null && this.musicID != null)
            this.musicSound.volume(this.volCache, this.musicID);
    }
}


// Fade in music
Audio.prototype.fadeInMusic = function(sound, vol, time) {

    if(this.musicID == null) {

        this.musicID = sound.play();
        this.musicSound = sound;
    }

    this.volCache = vol * this.musicVol;

    sound.volume(vol * this.musicVol, sound);
    sound.loop(true, this.musicID);
    if(!this.enabled) vol = 0.0;
    sound.fade(0.0, vol, time, this.musicID);
}

// Fade out music
Audio.prototype.fadeOutMusic = function(sound, vol, time) {

    if(this.musicID == null) {

        this.musicID = sound.play();
        this.musicSound = sound;
    }

    sound.volume(vol * this.musicVol, sound);
    sound.loop(true, this.musicID);
    if(!this.enabled) vol = 0.0;
    sound.fade(vol, 0.0, time, this.musicID);
}


// Pause music
Audio.prototype.stopMusic = function() {

    if(this.musicSound == null || this.musicID == null)
        return;

    this.musicSound.stop(this.musicID);
    this.musicID = null;
    this.musicSound = null;
}


// Pause music
Audio.prototype.pauseMusic = function() {

    if(this.musicSound == null || this.musicID == null)
        return;

    this.musicSound.pause(this.musicID);
}


// Resume music
Audio.prototype.resumeMusic = function() {

    this.musicSound.play(this.musicID);
}


// Play a sample
Audio.prototype.playSample = function(sound, vol) {

    if(!this.enabled) return;

    vol *= this.sampleVol;

    if(!sound.playID) {

        sound.playID = sound.play();

        sound.volume(vol, sound.playID );
        sound.loop(false, sound.playID );
    }
    else {

        sound.stop(sound.playID);
        sound.volume(vol, sound.playID );
        sound.loop(false, sound.playID );
        sound.play(sound.playID);
    }
}
