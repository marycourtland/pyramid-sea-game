/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures

var game;
$(document).ready(function() {
    game = new Phaser.Game(25*32, 20*32, Phaser.AUTO, document.getElementById('game'));

    // misc useful stuff
    window.hud_margin = 16;
    window.button_w = 32*6;
    window.button_h = 32*2;

    window.product_assets = {
        scented_air: 'product_bottled_air',
        dust_bunnies: 'product_dust_bunny',
        fresh_dirt: 'product_fresh_dirt',
        seasonal_pollen: 'product_seasonal_pollen',
        organic_grass: 'product_grass',
        artisanal_saltwater: 'product_artisanal_saltwater'
    }

    game.state.add('Game',Game);
    game.state.add('JoinGame', JoinGame);
    game.state.add('MainOffice', MainOffice);
    game.state.add('InCall', InCall);
    game.state.add('Warehouse', Warehouse);
    game.state.add('BrowsePlans', BrowsePlans);

    game.state.start('Game');
})
