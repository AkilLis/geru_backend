var clients = {}
var users = {}

function onUserJoined(userId, socket) {
	  try {
	    // The userId is null for new users.
	    //if (!userId) {
	       //var user = db.collection('users').insert({}, (err, user) => {
	       //console.log('User = ' + socket.id)
	       //socket.emit('userJoined', userId)
    	   socket.broadcast.emit('userJoined', userId)
	       users[socket.id] = userId
	       
	       //_sendExistingMessages(socket);
	       //});
 	       //} else {
	       //users[socket.id] = userId;
	       //_sendExistingMessages(socket);
	       //}
	  } catch(err) {
	       console.err(err)
	  }
}

module.exports = function (app, io) {
	io.on('connection', (socket) => {
	    clients[socket.id] = socket
	    socket.on('userJoined', (userId) => onUserJoined(userId, socket))
	    socket.on('disconnect', function (userId) { 
	    	//console.log(userId + 'has disconnected')
	    })
	    //socket.on('message', (message) => onMessageReceived(message, socket))
	})	
}

