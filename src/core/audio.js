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
}


// Toggle audio
Audio.prototype.toggle = function(state) {

    this.enabled = state;
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
