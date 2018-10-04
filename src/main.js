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

        font: "font.png",
        fontBig: "font_big.png",
        tinyText: "tiny_text.png",
        forest: "forest.png",
        sky: "sky.png",
        mountains: "mountains.png",
        clouds: "clouds.png",
        player: "player.png",
        shadow: "shadow.png",
        decorations: "decorations.png",
        hud: "hud.png",
        items: "items.png",
        checkpoint: "checkpoint.png",
        enemies: "enemies.png",
        ready: "ready.png",
    }
};

// Buttons
let buttonList = {

    fire1: 90,
    fire2: 88,
    confirm: 13,
    cancel: 27,
};


// Main
function main() {

    // Run application
    (new Application()).run(assetInfo,
        function(app) {

            app.addScene(new Global(app), true);
            app.addScene(new Game(app), false, true);
        },
        buttonList);
}
