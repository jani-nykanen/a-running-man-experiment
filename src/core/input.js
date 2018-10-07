/**
 * Input manager
 * 
 * @author Jani Nykänen
 */

// Reference to the input manager
let inputManRef = null;

// Key states
var State = {
    Up : 0,
    Down : 1,
    Pressed : 2,
    Released : 3,
};


// Constructor
var InputManager = function () {

    const KEY_STATE_MAX = 256;

    // Set refence to this
    inputManRef = this;

    // Set callback functions
    window.addEventListener("keydown", function(e) {
        e.preventDefault();
        inputManRef.keyPressed(e.keyCode);
    });
    window.addEventListener("keyup", function(e) {
        e.preventDefault();
        inputManRef.keyReleased(e.keyCode);
    });

    // Disable mouse
    window.addEventListener("mousedown", function(e) {
        window.focus();
        e.preventDefault();
    })

    // Key states
    this.keyStates = new Array(KEY_STATE_MAX);
    for(let i = 0; i < this.keyStates.length; ++ i) {

        this.keyStates[i] = State.Up;
    }

    // Any key pressed
    this.anyKeyPressed = false;
}


// Key pressed event
InputManager.prototype.keyPressed = function (key) {

    if(key < 0 || key >= this.keyStates.length 
        || this.keyStates[key] == State.Down)
        return;

    this.keyStates[key] = State.Pressed;
    this.anyKeyPressed = true;
}


// Key released event
InputManager.prototype.keyReleased = function (key) {

    if(key < 0 || key >= this.keyStates.length 
        || this.keyStates[key] == State.Up)
        return;

    this.keyStates[key] = State.Released;
}


// Update input manager
InputManager.prototype.update = function() {

    this.anyKeyPressed = false;

    // Update key states
    for(let i = 0; i < this.keyStates.length; ++ i) {

        if(this.keyStates[i] == State.Pressed) {

            this.keyStates[i] = State.Down;
        }
        else if(this.keyStates[i] == State.Released) {

            this.keyStates[i] = State.Up;
        }
    }
}


// Get a key state
InputManager.prototype.getKey = function(key) {

    if(key < 0 || key >= this.keyStates.length)
        return State.Up;

    return this.keyStates[key];
}
