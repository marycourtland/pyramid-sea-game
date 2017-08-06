/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    // plugins
    game.kineticScrolling = game.plugins.add(Phaser.Plugin.KineticScrolling);
    game.kineticScrolling.configure({
        kineticMovement: false,
        timeConstantScroll: 325,
        horizontalScroll: true,
        verticalScroll: false,
        horizontalWheel: true,
        verticalWheel: false,
        deltaWheel: 40
    });

    game.slickUI = game.plugins.add(Phaser.Plugin.SlickUI);


    game.load.spritesheet('customer_cards', 'assets/sprites/customer_cards.png', 320, 160);
    game.load.image('character', 'assets/sprites/hub_world_character.png');

    //Buildings
    game.load.image('building_1', 'assets/buildings/lavender_tower.png');
    game.load.image('building_2', 'assets/buildings/khaki_block.png');

    //Products
    game.load.image('product_bottled_air', 'assets/products/Bottled-Air.png');
    game.load.image('product_dust_bunny', 'assets/products/Dust-bunny.png');
    game.load.image('product_fresh_dirt', 'assets/products/Fresh-Dirt.png');
    game.load.image('product_seasonal_pollen', 'assets/products/Seasonal-Pollen.png');
};

Game.create = function(){
};


Game.initPlayer = function(name) {
    Client.newPlayer(name);
    // Player.init will be called after hearing back from server
}

// throwaway code?
Game.clickJoin = function() {
    var name = document.getElementById('input-name').value;
    Game.initPlayer(name);
    document.getElementById('name').remove();

    // testing!
    game.state.start('BrowsePlans');
}


