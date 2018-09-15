/**
 * Application
 * 
 * @author Jani Nykänen
 */


// A reference to the application, required for
// the callbacks
let appRef = null;


// Constructor
var Application = function() {

    // Constants
    const FRAME_RATE = 30.0;
    const CANVAS_NAME = "canvas";

    // Set defaults
    this.frameRate = FRAME_RATE;
    this.oldTime = 0.0;
    this.timeSum = 0.0;

    // Create components
    this.graphics = new Graphics(CANVAS_NAME);
    
    // Center the canvas
    this.graphics.centerCanvas(window.innerWidth, window.innerHeight);

    // Add events
    window.addEventListener("resize", function() {

        appRef.resize();
    })

    // Scenes
    this.scenes = [];
    this.activeScene = null;
    this.globalScene = null;
}


// Add a scene
Application.prototype.addScene = function(scene, global, active) {

    this.scenes.push(scene);

    if(global) {

        this.globalScene = scene;
    }

    if(active || this.activeScene == null) {

        this.activeScene = scene;
    }
}


// Resize event
Application.prototype.resize = function() {

    this.graphics.centerCanvas(window.innerWidth, window.innerHeight);
}


// Initialize
Application.prototype.init = function(assetInfo) {

    // Load assets
    this.assets = new AssetPack(assetInfo.bitmaps, assetInfo.bitmapPath);
}


// Draw the loading screen
Application.prototype.drawLoading = function(g) {

    this.graphics.clearScreen(0, 0, 0);
    // TODO: Loading bar
}


// The main loop
Application.prototype.loop = function(ts) {

    // With this we make sure the application
    // does not try to update a hundreds of frames
    // at the same time (e.g. if player has minified
    // the window)
    const MAX_UPDATES = 5;
    const COMPARED_FPS = 60;

    // Update time sum
    let target = 1.0 / this.frameRate;
    if(this.assets.hasLoaded) {

        let delta = ts - this.oldTime;
        this.timeSum += delta / 1000.0;
    }
    let tm = COMPARED_FPS / this.frameRate;

    let redraw = false;
    let updateCount = 0;

    // If enough time has passed, update frame
    while(this.assets.hasLoaded && this.timeSum >= target) {

        // Update global scene
        if(this.globalScene != null &&
            this.globalScene.update != null) {

            this.globalScene.update(tm);
        }

        // Update frame
        if(this.activeScene != null &&
            this.activeScene.update != null) {

            this.activeScene.update(tm);
        }

        this.timeSum -= target;
        redraw = true;

        // Update keyboard (we do this only once!)
        if(updateCount == 0) {

            // ...
        }

        if(++ updateCount >= MAX_UPDATES) {

            this.timeSum = 0.0;
            break;
        }
    }

    // Draw the frame
    if(redraw) {

        // If everything is loaded, draw the frame.
        // Otherwise draw the loading screen
        if(this.assets.hasLoaded()) {

            // Draw the active scene
            if(this.activeScene != null &&
                this.activeScene.draw != null) {

                this.activeScene.draw(this.graphics);
            }

            // Draw the global scene
            if(this.globalScene != null &&
                this.globalScene.draw != null) {

                this.globalScene.draw(this.graphics);
            }
        }
        else {

            this.drawLoading(this.graphics);
        }
    }

    this.oldTime = ts;

    // Request  the next frame
    requestAnimationFrame(function(ts) {

        appRef.loop(ts);
    });
}


// Run the application
Application.prototype.run = function(assetInfo, sceneFunc) {

    // Set reference to this object
    appRef = this;

    // Initialize
    this.init(assetInfo);

    // Add scenes (assuming the passed
    // sceneFunc really does that)
    if(sceneFunc != null) {

        sceneFunc(this);
    }

    // Run
    requestAnimationFrame(function(ts) {

        appRef.loop(ts);
    });
}
