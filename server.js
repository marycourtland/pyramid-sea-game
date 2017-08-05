var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var plans = require('./server/plans');

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});


io.on('connection',function(socket){

    socket.on('get_pyramid_plans', function(data, callback) {
        callback(null, plans);
    })

    socket.on('join_pyramid', function(data, callback) {
        // data.name
        // data.plan_id
        console.log(data.name + ' is joining pyramid plan ' + data.plan_id)

        var matching_plans = plans.filter(function(plan) {
            return plan.id === data.plan_id;
        })

        if (!matching_plans.length) { 
            callback('Outdated plan ID');
            return;
        }

        var plan = matching_plans[0];
        // Todo: put the player on the plan somehow
        
        socket.emit('notify', {message:'You joined this pyramid scheme! ' + JSON.stringify(plan)})
    })

    socket.on('set_pyramid_plans', function(data, callback) {
        // data: {name: 'me', plans:[ {product: X, rate:Y, amount:Z}, ... ]}

        // Todo
    })


    // Boilerplate

    socket.on('test',function(){
        console.log('test received');
    });
});


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
