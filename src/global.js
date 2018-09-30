/**
 * The global scene
 * 
 * @author Jani Nykänen
 */


// Constructor
var Global = function(app) {

    Scene.call(this,[app, "global"]);

    // Transition object
    this.trans = new Transition();
}
Global.prototype = Object.create(Scene.prototype);


// Update function
Global.prototype.update = function(tm) {

    // Update transition
    this.trans.update(tm);
}


// Rendering function
Global.prototype.draw = function(g) {

    // Draw transition
    this.trans.draw(g);
}
