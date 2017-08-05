/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();



Client.getPyramidPlans = function() {
    Client.socket.emit('get_pyramid_plans', {}, function(error, data) {
        console.log('PYRAMIDS:', data)
        // show these on the ui
    })
}

Client.joinPyramid = function(plan_id) {
    Client.socket.emit('join_pyramid', {plan_id: plan_id, name: 'me'});
}

// For when someone wants to set their distribution rates for other players
// Not sure if server should set the ID or not
Client.setPyramidPlans = function(plans) {
    //data: {name: 'me', plans:[ {id:123, product: X, rate:Y, amount:Z, price:P}, ... ]}
    Client.socket.emit('set_pyramid_plans', {
        name: Player.name,
        plans: plans
    })
}

// Notifications from server

Client.socket.on('notify', function(message, callback) {
    console.log('Notification from server:', message)
})


// Boilerplate


Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};
