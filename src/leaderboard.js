/**
 * Leaderboard scene
 * 
 * @author Jani Nykänen
 */

// Global key
let GLOBAL_KEY = "tmpkey123";


// Score entry constructor
var ScoreEntry = function(name, score) {

    this.name = name;
    this.value = score;
}


// Constructor
var Leaderboard = function(app) {

    const SCORE_MAX = 10;

    Scene.call(this,[app, "leaderboard"]);

    // Scores
    this.scores = new Array(SCORE_MAX);
    for(let i = 0; i < this.scores.length; ++ i) {

        this.scores[i] = new ScoreEntry("", 0);
    }

    // "Return" scene
    this.returnScene = null;

    // Is fetching
    this.fetching = false;
}
Leaderboard.prototype = Object.create(Scene.prototype);


// Send request
Leaderboard.prototype.sendRequest = function(params, cb) {

    const URL = "https://game-leaderboards.000webhostapp.com/runningman/"

    let url = URL + "?" + params;

    this.fetching = true;

    let xmlHttp = new XMLHttpRequest();
    let ref = this;
    xmlHttp.onreadystatechange = function() { 

        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

            console.log(xmlHttp.responseText);
            // Parse response
            let s = xmlHttp.responseText.split('|');
            let success = s[0] == "true";

            ref.fetching = false;
            cb(success, s.slice(1, s.length));
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}


// Set scores
Leaderboard.prototype.setScores = function(data) {

    for(var i = 0; i < data.length; i += 2) {

        this.scores[i/2].name = data[i];
        this.scores[i/2].value = parseInt(data[i+1]) / 10.0;
    }
}


// Fetch scores
Leaderboard.prototype.fetchScores = function() {

    let ref = this;
    this.sendRequest("mode=get", function(success, data) {

        if(!success) {

            console.log("ERROR: " + data[0]);
        }
        else {

            // Save scores
            ref.setScores(data);
        }
    });
}


// Send a score
Leaderboard.prototype.sendScore = function(name, score) {

    score = (score*10) | 0;
    let check = md5(GLOBAL_KEY + String(score));

    let ref = this;
    this.sendRequest("mode=set&name=" + name + "&score=" + String(score) + "&check=" + check, 
        function(success, data) {

        if(!success) {

            console.log("ERROR: " + data[0]);
        }
        else {

            // Save scores
            ref.setScores(data);
        }
    });
}


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

    // Draw "fetching"
    if(this.fetching) {

        g.drawText(f, "FETCHING...", 64, 64-4, -1, 0, true);
    }
    else {

        // Draw names
        for(let i = 0; i < NAME_COUNT; ++ i) {

            // Names
            g.drawText(f,this.scores[i].name, 4, 16 + i*9, -1, 0, false);

            // Scores
            g.drawText(f,this.getDistanceString(this.scores[i].value),
                64, 16 + i*9, -1, 0, false);
        }

    }

    // Draw "Press enter"
    g.drawText(f, "PRESS ENTER", 64, 128-14, -1, 0, true);
}


// On change
Leaderboard.prototype.onChange = function(scene) {

    this.returnScene = scene;
}
