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
    Client.getPyramidPlans(); // probably not needed

    // get this from the UI
    //Game.initPlayer('Me');
};

Game.initPlayer = function(name) {
    Client.newPlayer(name);
    // Player.init will be called after hearing back from server
}

// throwaway code?
Game.clickJoin = function() {
    var name = document.getElementById('input-name').value;
    Game.initPlayer(name);
}
