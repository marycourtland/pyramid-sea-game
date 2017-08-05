var Player = {};

Player.init = function(name, id) {
    this.id = id;
    this.name = name;

    // stats here?

    this.resetResources();

    Client.joinPyramid(0); // 0 is the starter pyramid
}

Player.resetResources = function() {
    this.bank = 100;
    this.clout = 0;

    // pull these from elsewhere
    this.plans = [
        {
            product: 'widgets',
            rate: 10,
            amount: 10
        }
    ]

    this.inventory = {
        widgets: 50
    }
}


