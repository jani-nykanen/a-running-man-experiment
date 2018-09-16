/**
 * A virtual gamepad. You got the point
 * 
 * @author Jani Nykänen
 */


// Constructor
var Vpad = function (buttonList, input) {

    this.input = input;

    // Create buttons
    this.buttons = {};
    this.buttonKeys = {};
    for (k in buttonList) {

        this.buttonKeys[k] = buttonList[k];
        this.buttons[k] = State.Up;
    }

    // "Analogue" stick
    this.stick = { x: 0, y: 0 };
    // Old stick state
    this.oldStick = { x: 0, y: 0 };
    // Stick delta
    this.delta = { x: 0, y: 0 };
}


// Update virtual game pad
Vpad.prototype.update = function() {

    this.oldStick.x = this.stick.x;
    this.oldStick.y = this.stick.y;

    this.stick.x = 0.0;
    this.stick.y = 0.0;

    // Left
    if(this.input.getKey(37) == State.Down) {

        this.stick.x = -1.0;
    }
    // Right
    else if(this.input.getKey(39) == State.Down) {

        this.stick.x = 1.0;
    }

    // Up
    if(this.input.getKey(38) == State.Down) {

        this.stick.y = -1.0;
    }
    // Down
    else if(this.input.getKey(40) == State.Down) {

        this.stick.y = 1.0;
    }

    // NOTE:
    // We could restrict the stick state to
    // the unit sphere S^1 := { (x,y) in R^2 | |(x,y)| = 1},
    // but it's not useful in this project since we
    // have no diagonal movement

    // Calculate delta
    this.delta.x = this.stick.x - this.oldStick.x;
    this.delta.y = this.stick.y - this.oldStick.y;

    // Update buttons
    for(k in this.buttonKeys) {

        this.buttons[k] = this.input.getKey(this.buttonKeys[k]);
    }
}
