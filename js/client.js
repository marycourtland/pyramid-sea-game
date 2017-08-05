/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();



Client.getPyramids = function() {
    Client.socket.emit('get_pyramids', {}, function(error, data) {
            console.log('PYRAMIDS:', data)
        })
}

Client.joinPyramid = function(pyramid) {
    Client.socket.emit('join_pyramid', {pyramid: pyramid, name: 'me'});
}

Client.setPyramidDeal = function(deals) {
    //data: {name: 'me', deals:[ {product: X, rate:Y, amount:Z}, ... ]}
    Client.socket.emit('set_pyramid_deal', {name: 'me', deals: deals})
}


// Boilerplate


Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});


