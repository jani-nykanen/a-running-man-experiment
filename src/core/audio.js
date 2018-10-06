/**
 * Audio routines
 * 
 * @author Jani Nykänen
 */

// Constructor
var Audio = function() {

    this.enabled = true;
}


// Toggle audio
Audio.prototype.toggle = function(state) {

    this.enabled = state;
}
