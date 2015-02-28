window.onload = function(){
	userName = prompt("Enter user name:");
	
	$("#userName").text( userName );
	socket.emit('add user', userName);
};

window.onunload = function(){
	socket.emit('remove user', userName);
};


var userName = null,
	socket = io(),
	messagesContainer = $('#messages'),
	infoLog = $('#infoLog'),
	usersOnlineContainer = $('#usersOnline');


$('form').submit(function(){
	var data = { msg: $('#m').val(), sender: userName };
	socket.emit('chat message', JSON.stringify(data));

	$('#m').val('');
	return false;
});


socket.on('user connected', function( usersList, userName ){
	updateUsersList( usersList );

	var msg = userName + " has entered the chat."
	updateInfoLog( msg );
});

socket.on('user disconnected', function(userName){
	var msg = userName + " has left the chat."
	updateInfoLog( msg );
});

socket.on('chat message', function( dataString ){
	postMessage( dataString );
	
	// auto scroll bottom
	var elem = document.getElementById('messages');
  	elem.scrollTop = elem.scrollHeight;
});

function getLastSender(){
	return $('#messages li').last().attr('sender');
}

function postMessage( dataString ){
	var data = JSON.parse( dataString ),
		lastSender = getLastSender(),
		li = null;

	if ( data.sender === userName && lastSender === userName ) {
		li = $('<li>').text( data.msg );
	} else {
		if ( data.sender === lastSender ) {
			li = $('<li>').text( data.msg );
		} else {
			messagesContainer.append($('<li>').text(data.sender + ": "));
			li = $('<li>').text( data.msg );
		}
	}
	
	li.attr('sender', data.sender);

	if ( data.sender === userName ) {
		li.addClass('myMsg');
	} else {
		li.addClass('friendsMsg');
	}

	messagesContainer.append(li);
}

function updateUsersList( usersList ){
	$('#usersOnline li').remove();
	
	usersList.forEach(function(user){
		usersOnlineContainer.append($('<li>').text( user ));
	});
}

function updateInfoLog( msg ){
	infoLog.append( $('<li>').text( msg ) );

	// auto scroll bottom
	var elem = document.getElementById('infoLog');
  	elem.scrollTop = elem.scrollHeight;
}