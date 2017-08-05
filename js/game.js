/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.image('sprite','assets/sprites/sprite.png');
};

Game.create = function(){
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);
    Client.getPyramidPlans();

    Game.initPlayer('Me');
};

Game.initPlayer = function(name) {
    Player.init(name);
    Client.joinPyramid(0); // 0 is the starter pyramid
}


