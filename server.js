var app = require('./app')
var server = require('http').Server(app)
var io = require('socket.io')(server)
require('./socket')(app, io)

var port = process.env.PORT || 3000

server.listen(port, function() {
  console.log('Express server listening on port ' + port)
})

