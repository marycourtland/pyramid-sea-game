/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures

var game;
$(document).ready(function() {
    game = new Phaser.Game(25*32, 20*32, Phaser.AUTO, document.getElementById('game'));

    game.state.add('Game',Game);
    game.state.add('JoinGame', JoinGame);
    game.state.add('MainOffice', MainOffice);
    game.state.add('InCall', InCall);
    game.state.add('Warehouse', Warehouse);
    game.state.add('BrowsePlans', BrowsePlans);

    game.state.start('Game');
})
