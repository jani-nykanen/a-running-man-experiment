#!/bin/sh

# Creates distribution package
mkdir dist
cp -rf assets dist/assets
cp -R index_dist.html dist/index.html
cp -R style.css dist/style.css
java -jar ~/tools/closure.jar --js src/lib/md5.min.js src/lib/howler.min.js  src/core/application.js src/core/transformation.js src/core/graphics.js src/core/assets.js src/core/scene.js src/core/input.js src/core/vpad.js src/core/sprite.js src/core/utility.js src/core/audio.js  src/game/enemies/base.js src/game/enemies/passive.js src/game/enemies/horizontal.js src/game/enemies/jumping.js src/game/enemies/flying.js src/game/enemies/following.js src/game/enemies/big.js  src/game/background.js src/game/decoration.js src/game/roadpiece.js src/game/road.js src/game/player.js src/game/objbuffer.js src/game/hud.js src/game/item.js src/game/itemgen.js src/game/checkpoint.js src/game/pause.js src/game/enemygen.js src/game/gameover.js src/game/game.js  src/transition.js src/menu.js src/leaderboard.js src/intro.js src/title.js src/global.js src/main.js --js_output_file dist/dist.js
cd dist
zip -r ../dist.zip ./
cd ..