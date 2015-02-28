var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	path = require('path'),
	io = require('socket.io')(http);

var usersList = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	// console.log('a user connected');

	socket.on('add user', function( userName ){
		usersList.push( userName );
		io.emit('user connected', usersList, userName);
	});

	socket.on('remove user', function( userName ){
		usersList.splice( usersList.indexOf( userName ), 1)
		io.emit('user disconnected', userName);
	});

	socket.on('disconnect', function(){
		// console.log('user disconnected');
	});

	socket.on('chat message', function( dataString ){
		// var data = JSON.parse( dataString );
		io.emit('chat message', dataString);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});