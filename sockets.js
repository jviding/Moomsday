var HashTable = require('hashtable');
var hashtable = new HashTable();

module.exports = function Sockets(io) {

  io.on('connection', function (socket) {
    
      //new user joins
      socket.on('join', function () {
        console.log('user connected');
        hashtable.put(socket.id, {'id':socket.id, 'location': {'x': 0, 'y': 0}});
        io.to(socket.id).emit('get join', {'id':socket.id, 'players':hashtable.size()});
        socket.broadcast.emit('new player');
      });

      //player moves
      socket.on('player', function (data) {
        var moved = hashtable.get(socket.id);
        hashtable.remove(socket.id);
        if (moved != undefined) {
          moved['location'] = data;
          hashtable.put(socket.id, moved);
        }
      });

      //update player locations
      setInterval(function() { 
        var players = {'players': []};
        hashtable.forEach(function (key, value) {
          players.players.push(value);
        });
        io.emit('update', players);
      }, 100);

      //user disconnected
      socket.on('disconnect', function () {
        console.log('user disconnected');
        io.emit('disconnected', {'id':socket.id});
        hashtable.remove(socket.id);
      });
  });
};