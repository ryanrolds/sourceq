
var bufferpack = require('bufferpack');

module.exports = {
  'message': function(challenge) {
    return bufferpack.pack('<lcl', [-1, 'U', challenge || -1]);
  },
  'processor': function(buffer, position) {
    if(!position) {
      position = 0;
    }

    var headerFormat = '<c(type)b(numPlayers)';
    var data = bufferpack.unpack(headerFormat, buffer, position);
    data.players = [];

    position += 6;
    var playerFormat = '<b(index)S(name)l(kills)f(secondsConnected)';
    for(var i = 0, l = data.numPlayers; i < l; i++) {
      var player = bufferpack.unpack(playerFormat, buffer, position);
      player.index = player.index || i;
      data.players.push(player);
      position += 10 + player.name.length;
    }

    return data;
  }
};