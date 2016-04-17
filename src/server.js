var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('./'));

app.get('/presenter', function(req, res){
	res.sendFile(__dirname + '/finlotteri.html');
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket){
	socket.on('newConnection',  function(msg){
		socket.Type = msg;   
	});
	
	socket.on('initiate', function(){
		var clients = findClientsSocket();
		for (var i = 0, len = clients.length; i < len; i++) {
			clients[i].HasRequestedStop = 0;
		}
		socket.broadcast.emit('initiate');
	});
	
	socket.on('userConnected', function(username){
		socket.broadcast.emit('userConnected', username);
	});
	
	socket.on('clientWantsToStop', function(username){
		socket.HasRequestedStop = 1;
		
		socket.broadcast.emit('clientRequestedStop', username);
		
		var clients = findClientsSocket();
		for (var i = 0, len = clients.length; i < len; i++) {
			if(clients[i].Type === 'client' && clients[i].HasRequestedStop == 0)
				return;
		}
		
		socket.broadcast.emit('clientsWantsToStop');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

function findClientsSocket(roomId, namespace) {
    var res = []
    , ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId) ;
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}