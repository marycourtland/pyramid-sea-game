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

Client.getPyramidPlans = function() {
    Client.socket.emit('get_pyramid_plans', {}, function(error, plans) {
        console.log('PYRAMIDS:', plans)
        // show these on the ui
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

})

Client.socket.on('current_bank_balance', function(data, callback) {
    // data.player_id
    // data.balance
    // data.change
    var change_string = data.change < 0 ? data.change.toString() : '+' + data.change;
    console.log('Bank balance: ' + change_string + ' => ' + data.balance);
})

Client.socket.on('current_inventory', function(data, callback) {
    // data.player_id
    // data.product
    // data.quantity
    // data.change
    var change_string = data.change < 0 ? data.change.toString() : '+' + data.change;
    console.log('Inventory for ' + data.product + ": " + change_string + ' => ' + data.quantity);
})

Client.socket.on('notify', function(message, callback) {
    console.log('Notification from server:', message)
})


// Boilerplate


Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};
