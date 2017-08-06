var Player = {};

Player.init = function(name, id) {
    this.id = id;
    this.name = name;
    this.plan = null;

    // stats here?

    this.resetResources();

    Client.joinPyramid(0); // 0 is the starter pyramid
}

Player.resetResources = function() {
    this.bank = 100;
    this.clout = 0;

    this.inventory = {
        widgets: 50
    }
}

Player.setPlan = function(plan) {
    this.plan = plan;
}

