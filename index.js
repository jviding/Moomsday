var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sockets = require('./sockets');
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('*', function (req, res) {
  res.sendFile('index.html');
});

//launch
http.listen(port, function(){
  console.log('Server listening on port: ' + port);
});

//start socket.io
sockets(io);