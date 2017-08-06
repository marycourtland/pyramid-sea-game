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
    game.load.spritesheet('character-walking', 'assets/sprites/Hub-world-walk-cycle.png', 32, 32, 4);
    game.load.image('main-office', 'assets/Desk-Scene.png');

    //Buildings
    game.load.image('building_1', 'assets/buildings/lavender_tower.png');
    game.load.image('building_2', 'assets/buildings/khaki_block.png');
    game.load.image('building_3', 'assets/buildings/Onyx_tower.png');
    game.load.image('building_4', 'assets/buildings/Rose_tower.png');
    game.load.image('building_5', 'assets/buildings/Sapphire_tower.png');

    //Products
    game.load.image('product_bottled_air', 'assets/products/Bottled-Air.png');
    game.load.image('product_dust_bunny', 'assets/products/Dust-bunny.png');
    game.load.image('product_fresh_dirt', 'assets/products/Fresh-Dirt.png');
    game.load.image('product_seasonal_pollen', 'assets/products/Seasonal-Pollen.png');

	//Characters
	game.load.image('player_convo','assets/characters/player.png');
	game.load.image('teen_convo_1','assets/characters/Teen_01.png');
	game.load.image('teen_convo_2','assets/characters/Teen_02.png');
	game.load.image('teen_convo_3','assets/characters/Teen_03.png');
	game.load.image('middle_convo_1','assets/characters/Middle_age_01.png');
	game.load.image('middle_convo_2','assets/characters/Middle_age_02.png');
	game.load.image('middle_convo_3','assets/characters/Middle_age_03.png');
	game.load.image('aged_convo_1','assets/characters/Aged_01.png');
	game.load.image('aged_convo_2','assets/characters/Aged_02.png');
	game.load.image('aged_convo_3','assets/characters/Aged_03.png');
};

Game.create = function(){

    // set up container for HTML elements
    var $canvas = $("#game canvas");
    $("#game-html").css({
        top: $canvas.offset().top,
        left: $canvas.offset().left,
        width: game.width,
        height: game.height
    })

    // Make sure the html gets cleared on state change
    var _start_state = game.state.start;
    game.state.start = function() {
        $("#game-html").empty();
        _start_state.apply(game.state, arguments);
    }

    game.state.start('JoinGame');

};
