/**
 * Scene base class
 * 
 * @author Jani Nykänen
 */


// Constructor
var Scene = function(arg) {

    const app = arg[0];
    const name = arg[1];

    this.name = name;

    // Get application content
    this.assets = app.assets;
    this.input = app.input;
}
