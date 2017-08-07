var Player = {};

Player.init = function(name, id) {
    console.log('init', name, id)
    this.id = id;
    this.name = name;
    this.plan = null;

    // stats here?

    this.resetResources();

    Client.joinPyramid(0); // 0 is the starter pyramid
}

Player.resetResources = function() {
    this.bank_account = 3000;
    this.clout = 0;

    this.inventory = {
    }
}

Player.setPlan = function(plan) {
    this.plan = plan;
}

