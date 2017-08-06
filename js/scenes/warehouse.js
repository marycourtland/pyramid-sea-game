var Warehouse = {};

Warehouse.preload = function() {
    game.slickUI.load('assets/ui/kenney/kenney.json');
}

Warehouse.create = function() {
    game.stage.backgroundColor = "#949292";
    addButton(game.slickUI,
        hud_margin,
        hud_margin,
        button_w,
        button_h,
        'Back to Office',
        function() { game.state.start('MainOffice') }
    );  
}
