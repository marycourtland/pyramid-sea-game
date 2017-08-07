/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.newPlayer = function(name) {
    Client.socket.emit('new_player', {name: name}, function(error, player) {
        Player.init(name, player.id);

        // todo: copy over the rest of the player vars...?
    })
}

Client.getPyramidPlans = function(callback) {
    Client.socket.emit('get_pyramid_plans', {}, function(error, plans) {
        console.log('PYRAMIDS:', plans)
        callback(plans);
    })
}

Client.joinPyramid = function(plan_id) {
    Client.socket.emit('join_pyramid', {
        player_id: Player.id,
        plan_id: plan_id
    });
}

// For when someone wants to set their distribution rates for other players
// Not sure if server should set the ID or not
Client.setPyramidPlan = function(plan) {
    // Todo: if the player had an old plan, send retired_plan_id
    Client.socket.emit('set_pyramid_plan', {
        player_id: Player.id,
        plan: plan
    })
}


// Notifications from server

Client.socket.on('tick', function(data, callback) {
    var diff = new Date() - new Date(data.time);
    console.log('server tick=' + data.tick + ' diff=' + diff + 'ms');

    // Check for inventory transfers
})

Client.socket.on('joined_plan', function(data, callback) {
    // data.plan
    console.log('You joined this plan! ' + JSON.stringify(data.plan))
})

Client.socket.on('someone_joined_your_plan', function(data, callback) {
    // data.player_id
    // data.name
    // data.plan
    console.log('Someone joined your plan!', data.name, data.player_id);
})

Client.socket.on('current_bank_balance', function(data, callback) {
    // data.player_id
    // data.balance
    // data.change
    var change_string = data.change < 0 ? data.change.toString() : '+' + data.change;
    console.log('Bank balance: ' + change_string + ' => ' + data.balance);

    Player.bank_account = data.balance;
    MainOffice.updateBank(data.balance)
})

Client.socket.on('current_inventory', function(data, callback) {
    // data.player_id
    // data.product
    // data.quantity
    // data.change
    var change_string = data.change < 0 ? data.change.toString() : '+' + data.change;
    console.log('Inventory for ' + data.product + ": " + change_string + ' => ' + data.quantity);
})


// Misc Alerts

Client.socket.on('low_bank_balance', function(data, callback) {
    // data.player_id
    // data.bank_balance
    // data.threshhold
    console.log('** WARNING: LOW BANK BALANCE (under' + data.threshhold + ')');
})


Client.socket.on('notify', function(message, callback) {
    console.log('Notification from server:', message)
})


// Boilerplate


Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};
