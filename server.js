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
            socket_id: socket.id
        }
        players.push(player);
        callback(null, player.id);
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
}
later.setInterval(doTick, later.parse.recur().every(settings.tick_seconds).second());


// Internal functions

function getAllSockets() {
    return Object.keys(io.sockets.connected).map(function(socket_id) {
        return io.sockets.connected[socket_id];
    })
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


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
