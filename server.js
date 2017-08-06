var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var _ = require('lodash');
var moment = require('moment');
var later = require('later');

var plans = require('./server/plans');
var players = require('./server/players');

var settings = {
    tick_seconds: 5 // send a synchronized tick to the clients every this-many seconds
}


app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

// For debugging
app.get('/players', function(req, res) {
    res.set({'content-type': 'application/json'});
    res.end(JSON.stringify(players, null, '  '));
})

app.get('/plans', function(req, res) {
    res.set({'content-type': 'application/json'});
    res.end(JSON.stringify(plans, null, '  '));
})


server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});


io.on('connection',function(socket){
    socket.on('new_player', function(data, callback) {
        // data.name

        var player = {
            id: nextId(players),
            created_time: moment(),
            name: data.name,
            socket_id: socket.id,

            // Initial player resources
            bank_account: 1000,
            clout: 0,
            inventory: {}
        }

        players.push(player);
        callback(null, player);
    })

    socket.on('get_pyramid_plans', function(data, callback) {
        callback(null, plans);
    })

    socket.on('join_pyramid', function(data, callback) {
        // data.player_id
        // data.plan_id

        var player = _.find(players, {id: data.player_id});
        var plan = _.find(plans, {id: data.plan_id});
        console.log(player.name + ' is joining pyramid plan ' + data.plan_id)

        if (!plan) { 
            callback('Outdated plan ID');
            return;
        }

        // **db
        player.plan_id = plan.id;
        
        socket.emit('notify', {message:'You joined this pyramid scheme! ' + JSON.stringify(plan)})
    })


    // Player wants to set their rates for underling players
    socket.on('set_pyramid_plan', function(data, callback) {
        // data.player_id
        // data.plan
        // data.retired_plan_id

        createPlan(data.player_id, data.plan);
        
        if (data.retired_plan) {
            var old_plan = _.find(plans, {id: data.retired_plan_id});
            retirePlan(old_plan);
        }
    })

    // Boilerplate

    socket.on('test',function(){
        console.log('test received');
    });
});

// Master timer to synchronize scheduled things
var tick = 0;
function doTick() {
    tick += 1;
    var time = moment().startOf('second');
    console.log('Tick', tick, time.toString());

    // Send tick to everyone
    getAllSockets().forEach(function(socket) {
        socket.emit('tick', {
            time: time,
            tick: tick
        })
    })

    // See if there are any plan transactions to process
    // (the frequencies are per-product)

    var active_plans = []; // this is a list of [plan, products] pairs
    // (the whole array of plan products might not be processed each time -
    // just the ones with the right frequency)

    plans.forEach(function(plan) {
        var products = _.filter(plan.products, function(item) {
            return tick % item.frequency === 0;
        })

        if (products.length > 0) active_plans.push([plan, products]);
    })

    active_plans.forEach(function(plan_products) {
        doPlanTransfers(plan_products[0], plan_products[1]);
    })
}
later.setInterval(doTick, later.parse.recur().every(settings.tick_seconds).second());


// Internal functions

function getAllSockets() {
    return Object.keys(io.sockets.connected).map(function(socket_id) {
        return io.sockets.connected[socket_id];
    })
}

function getSocketById(socket_id) {
    return io.sockets.connected[socket_id];
}

function nextId(collection) {
    return _.maxBy(collection, 'id').id + 1;
}

function createPlan(player_id, plan) {
    var player = _.find(players, {id: player_id});

    plan.id = nextId(plans);
    plan.player_id = player.id;
    plan.distributor = player.name;
    plan.created_time = moment();
    plan.retired_time = null;
    plan.retired = false;
        
    //**db
    plans.push(data.plan);

    player.offered_plan_id = plan.id;
}

function retirePlan(old_plan_id) {
    // Todo:
    // - need to notify all the people who joined this plan 
    // - give them a grace period
    // - schedule an event to kick everyone off after the grace period

    var old_plan = _.find(plans, old_plan_id);
    var plan_participants = _.filter(players, {plan_id: old_plan.id});

    // **db
    old_plan.retired = true;
    old_plan.retired_time = moment();
}

// the products passed in should be a subset of plan.products
function doPlanTransfers(plan, products) {
    console.log('doPlanTransfers', plan.id, products.map(function(p) { return p.product; }).join(','))
    // The person selling the product (* might not exist if it's a non-player plan)
    var distributor = _.find(players, {id: plan.player_id});

    // The people buying the product
    var receivers = _.filter(players, {plan_id: plan.id});


    // How much the distributor will end up getting
    // (it could also just be multiplied out)
    var total_transaction_amount = 0; 

    receivers.forEach(function(player) {
        // Money
        var amount = products.reduce(function(total, item) {
            return total + item.price_per_unit * item.quantity;
        }, 0);

        total_transaction_amount += amount;
        updateBankAccount(player.id, -amount);

        // Inventory
        products.forEach(function(item) {
            updateInventory(player.id, item.product, item.quantity);
        })
    })

    // Deposit into distributor's account
    // ** Except if the distributor has a boss, they'll take a cut, too
    if (distributor) {
        // this is the "grandfather" plan that defines the cut going to the distributor's boss
        var distributor_plan = _.get(plans, {id: distributor.plan_id})
        var remainder_after_cut = total_transaction_amount;
        if (distributor_plan) {
            var boss = _.get(players, {id: distributor})
            var boss_cut = distributor_plan.cut * total_transaction_amount;
            remainder_after_cut -= boss_cut;

            // if boss exists, it's a player
            if (boss) {
                updateBankAccount(boss.id, boss_cut);
            }
        }

        updateBankAccount(distributor.id, remainder_after_cut);

        products.forEach(function(item) {
            var total_inventory_deduction = item.quantity * receivers.length;
            updateInventory(distributor.id, item.product, -total_inventory_deduction);
        })
    }
    else {
        // it's a non-player; do nothing
    }
}


// Pass in a negative amount if it's a deduction
function updateBankAccount(player_id, amount) {
    var player = _.find(players, {id: player_id});

    player.bank_account += amount;

    getSocketById(player.socket_id).emit('current_bank_balance', {
        player_id: player_id, //not strictly necessary
        balance: player.bank_account,
        change: amount
    })
}

// Pass in a negative quantity if it's a deduction
function updateInventory(player_id, product, quantity) {
    var player = _.find(players, {id: player_id});

    if (!(product in player.inventory)) { player.inventory[product] = 0; }
    player.inventory[product] += quantity;

    getSocketById(player.socket_id).emit('current_inventory', {
        player_id: player_id, //not strictly necessary
        product: product,
        quantity: player.inventory[product],
        change: quantity
    })
}

