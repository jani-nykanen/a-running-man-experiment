/**
 * Leaderboard scene
 * 
 * @author Jani Nykänen
 */


// Score entry constructor
var ScoreEntry = function(name, score) {

    this.name = name;
    this.value = score;

    this.returnScene = null;
}


// Constructor
var Leaderboard = function(app) {

    const SCORE_MAX = 10;

    Scene.call(this,[app, "leaderboard"]);

    // Scores
    this.scores = new Array(SCORE_MAX);
    for(let i = 0; i < this.scores.length; ++ i) {

        this.scores[i] = new ScoreEntry("NOBODY" + String(i),1000- i*100);
    }

}
Leaderboard.prototype = Object.create(Scene.prototype);


// Get distance string
Leaderboard.prototype.getDistanceString = function (f) {

    let s = "";
    let x = Math.floor(f * 10) / 10.0;
    s = String(x);
    if (x == (x  | 0))
        s += ".0";

    return s + "m";
}


// Update function
Leaderboard.prototype.update = function(tm) {

    if(this.global.trans.active) return;

    // Check confirm key pressing
    if(this.vpad.buttons.confirm == State.Pressed) {

        let s = this.returnScene;
        this.global.trans.activate(2.0, Mode.In, function() {

            appRef.changeScene(s.name);
        });
    }
}


// Rendering function
Leaderboard.prototype.draw = function(g) {

    // TODO: Constants vs numeric constants

    const NAME_COUNT = 10;
    const f = this.assets.bitmaps.font;

    // Draw background box
    g.clearScreen(255, 255, 255);

    g.setGlobalColor(0, 0, 0);
    g.fillRect(1, 1, 128-2, 128- 2);

    g.setGlobalColor(85, 85, 85);
    g.fillRect(2, 2, 128-4, 128- 4);
    
    // Draw title
    g.drawText(f, "LEADERBOARD", 64, 4, -1, 0, true);

    // Draw names
    for(let i = 0; i < NAME_COUNT; ++ i) {

        // Names
        g.drawText(f,this.scores[i].name, 4, 16 + i*9, -1, 0, false);

        // Scores
        g.drawText(f,this.getDistanceString(this.scores[i].value),
            64, 16 + i*9, -1, 0, false);
    }

    // Draw "Press enter"
    g.drawText(f, "PRESS ENTER", 64, 128-14, -1, 0, true);
}


// On change
Leaderboard.prototype.onChange = function(scene) {

    this.returnScene = scene;
}
