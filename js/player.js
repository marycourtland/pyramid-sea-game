var Player = {};

Player.init = function(name) {
    this.name = name;

    // stats here?

    this.resetResources();

    // starter boss
    Client.send
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


