var BrowsePlans = {};

BrowsePlans.preload = function() {
    this.plans = [];

    game.slickUI.load('assets/ui/kenney/kenney.json');
}

BrowsePlans.create = function() {
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);

    var self = this;

    Client.getPyramidPlans(function(plans) {
        self.plans = plans;

        // Todo: group each according to size
        // just use building 1 for now

        var street_height = 128;
        var street_Y = game.height - street_height;
        var building_width = 320;
        var building_offset_X = 32;
        
        var street_length = self.plans.length * building_width + building_offset_X;

        game.world.setBounds(0, 0, street_length, game.height);

        self.buildings = self.plans.map(function(plan, i) {
            var sprite = game.add.sprite(i*building_width + building_offset_X, street_Y, 'building_1');
            //anchor to bottom left
            sprite.anchor.x = 0;
            sprite.anchor.y = 1;

            sprite.inputEnabled = true;
            sprite.input.useHandCursor = true;

            return sprite;
        })

        // street
        var street = addRectangle(0, street_Y, street_length, street_height, {r:120, g:120, b:120});

        // sky
        game.stage.backgroundColor = "#e2f6ff";

        // Plan details 
        // TODO: wire up the correct selected plan
        var selected_plan = self.plans[0];
        var details_width = 320;
        var details_margin = 8;
        var details_panel = new SlickUI.Element.Panel(
            game.width - details_width - 2*details_margin,
            details_margin,
            game.width - 2*details_margin,
            game.height - 2*details_margin
        );
        game.slickUI.add(details_panel);
        var text = selected_plan.distributor + "'s Deal"
        details_panel.add(new SlickUI.Element.Text(10,0, text)).centerHorizontally()



        game.kineticScrolling.start();
    });
}

BrowsePlans.onLeave = function() {
    game.world.setBounds(0, 0, game.length, game.height);
    game.kineticScrolling.stop();
}

