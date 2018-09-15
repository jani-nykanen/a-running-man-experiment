/**
 * Main file
 * Contains the "main" function. Launches
 * the application.
 * 
 * @author Jani Nykänen
 */

// Assets
let assetInfo = {

    bitmapPath : "assets/bitmaps/",
    bitmaps: {

        font: "font.png"
    }
};


// Main
function main() {

    // Run application
    (new Application()).run(assetInfo,
        function(app) {

            app.addScene(new Game(app), false, true);
            app.addScene(new Global(app), true);
        });
}
