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
        logo: "logo.png",
        creator: "creator.png",
    }
};

// Buttons
let buttonList = {

    fire1: 90,
    fire2: 88,
    confirm: 13,
    cancel: 27,
    test: 65,
};


// Main
function main() {

    // Run application
    (new Application()).run(assetInfo,
        function(app) {

            app.addScene(new Global(app), true);
            app.addScene(new Game(app), false);
            app.addScene(new Leaderboard(app), false);
            app.addScene(new Title(app), false);
            app.addScene(new Intro(app), false, true);
        },
        buttonList);
}
