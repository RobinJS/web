var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile('/HTML5/dev-branches/pvelinov/SocketIOTest/index.html');
});

var usersOnline = [];

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('user connecting', function( userName ){
		
		if ( usersOnline.indexOf( userName ) == -1 ) {
			usersOnline.push( userName );
			io.emit('update online users', usersOnline, [userName, socket.handshake.address]);
		} else {
			io.emit('ask for username', usersOnline);
		}

	});

	socket.on('user disconnecting', function( userName ){
		usersOnline.splice( usersOnline.indexOf(userName), 1);
		io.emit('update online users', usersOnline);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('chat message', function( data ){

    	io.emit('chat message', data); // to everyone, incl sender
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});