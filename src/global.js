/**
 * The global scene
 * 
 * @author Jani Nykänen
 */


// Constructor
var Global = function(app) {

    Scene.call(this,[app, "global"]);

}
Global.prototype = Object.create(Scene.prototype);


// Update function
Global.prototype.update = function(tm) {

    // ...
}


// Rendering function
Global.prototype.draw = function(g) {

}
