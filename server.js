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
    // send a synchronized tick to the clients every this-many seconds
    tick_seconds: 5,

    // when to notify player they have a low balance?
    low_bank_balance_threshhold: 200
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
        
        socket.emit('joined_plan', {plan: plan});
        emitToPlayer(player, 'joined_plan', {plan: plan})

        //Notify the plan's distributor/boss
        var plan_distributor = _.find(players, {id: plan.player_id})
        if (plan_distributor) {
            emitToPlayer(plan_distributor, 'someone_joined_your_plan', {
                player_id: player.id,
                name: player.name,
                plan: plan
            })
        }
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

function emitToPlayer(player, event, data) {
    var socket = getSocketById(player.socket_id);
    if (!socket) return;
    socket.emit(event, data);
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

    var boss = null; // will get populated

    // How much the distributor will end up getting
    // (it could also just be multiplied out)
    var total_transaction_amount = 0; 

    var bank_updates = []; // Arrays of [player_id, amount]
    var inventory_updates = []; // Arrays of [player_id, product, quantity]

    receivers.forEach(function(player) {
        // Money
        var amount = products.reduce(function(total, item) {
            return total + item.price_per_unit * item.quantity;
        }, 0);

        total_transaction_amount += amount;
        bank_updates.push([player.id, -amount]);

        // Inventory
        products.forEach(function(item) {
            inventory_updates.push([player.id, item.product, item.quantity])
        })
    })

    // Deposit into distributor's account
    // ** Except if the distributor has a boss, they'll take a cut, too
    if (distributor) {
        // this is the "grandfather" plan that defines the cut going to the distributor's boss
        var distributor_plan = _.get(plans, {id: distributor.plan_id})
        var remainder_after_cut = total_transaction_amount;
        if (distributor_plan) {
            var boss = _.get(players, {id: distributor_plan.player_id})
            var boss_cut = distributor_plan.cut * total_transaction_amount;
            remainder_after_cut -= boss_cut;

            // if boss exists, it's a player
            if (boss) {
                bank_updates.push([boss.id, boss_cut]);
            }
        }

        bank_updates.push([distributor.id, remainder_after_cut]);

        products.forEach(function(item) {
            var total_inventory_deduction = item.quantity * receivers.length;
            inventory_updates.push([distributor.id, item.product, -total_inventory_deduction]);
        })
    }
    else {
        // it's a non-player; do nothing
    }

    // Only execute all these updates if it won't break the bank for anyone.
    var bankruptcy = checkForBankruptcy(bank_updates, inventory_updates);

    if (bankruptcy.bank.length === 0 && bankruptcy.inventory.length === 0) {
        // no one goes bankrupt, yay!
        bank_updates.forEach(function(item) { updateBankAccount.apply(null, item); });
        inventory_updates.forEach(function(item) { updateInventory.apply(null, item); });
    }
    else {
        // Someone can't do the transaction. Cancel everything and send alerts out 
        // TODO: what data to send?
        receivers.forEach(function(player) { emitToPlayer(player, 'transaction_cancelled'); })
        if (distributor) emitToPlayer(distributor, 'transaction_cancelled');
        if (boss) emitToPlayer(boss, 'transaction_cancelled'); // they lost their cut
    }
}

function checkForBankruptcy(bank_updates, inventory_updates) {
    // collect by player
    var bank_updates_by_player = {};
    var inventory_updates_by_player = {}; // this has nested per-product things, too

    bank_updates.forEach(function(item) {
        var player_id = item[0];
        if (!bank_updates_by_player[player_id]) bank_updates_by_player[player_id] = 0;
        bank_updates_by_player[player_id] += item[1];
    })

    inventory_updates.forEach(function(item) {
        var player_id = item[0];
        var product = item[1];
        if (!inventory_updates_by_player[player_id]) inventory_updates_by_player[player_id] = {};
        if (!inventory_updates_by_player[player_id][product]) inventory_updates_by_player[player_id][product] = 0;
        inventory_updates_by_player[player_id][product] += item[2];
    })

    // now check each player's accounts

    var bankruptcy = {bank: [], inventory: []}

    for (var player_id in bank_updates_by_player) {
        var player = _.find(players, {id: parseInt(player_id)});
        if (player.bank_account + bank_updates_by_player[player_id] < 0) {
            bankruptcy.bank.push(player_id);
        }
    }

    for (var player_id in inventory_updates_by_player) {
        var player = _.find(players, {id: parseInt(player_id)});
        for (var product in inventory_updates_by_player[player_id]) {
            if ((!player.inventory[product]) || player.inventory[product] + inventory_updates_by_player[player_id][product] < 0) {
                bankruptcy.inventory.push(player_id);
            }
        }
    }

    // this might have duplicates
    bankruptcy.inventory = _.uniq(bankruptcy.inventory);

    return bankruptcy;
}


// Pass in a negative amount if it's a deduction
function updateBankAccount(player_id, amount) {
    var player = _.find(players, {id: player_id});

    player.bank_account += amount;

    emitToPlayer(player, 'current_bank_balance', {
        player_id: player_id, //not strictly necessary
        balance: player.bank_account,
        change: amount
    })

    if (player.bank_account < settings.low_bank_balance_threshhold) {
        emitToPlayer(player, 'low_bank_balance', {
            player_id: player_id, //not strictly necessary
            balance: player.bank_account,
            threshhold: settings.low_bank_balance_threshhold
        })
    }
}

// Pass in a negative quantity if it's a deduction
function updateInventory(player_id, product, quantity) {
    var player = _.find(players, {id: player_id});

    if (!(product in player.inventory)) { player.inventory[product] = 0; }
    player.inventory[product] += quantity;

    emitToPlayer(player, 'current_inventory', {
        player_id: player_id, //not strictly necessary
        product: product,
        quantity: player.inventory[product],
        change: quantity
    })
}

