var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('./'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/finlotteri.html');
});

io.on('connection', function(socket){
	socket.on('initiate', function(msg){
		io.broadcast('initiate', msg);
	});
	socket.on('initiate', function(msg){
		io.broadcast('initiate', msg);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});