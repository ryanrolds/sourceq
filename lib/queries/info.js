
var buffer = require('buffer');

var bufferpack = require('bufferpack');

module.exports = {
  'message': function() {
    return bufferpack.pack('<iS', [-1, 'TSource Engine Query']);
  },
  'processor': function(buff, position) {
    var format = '<i(split)c(type)b(version)S(name)S(map)S(directory)S(description)h(appId)'
      + 'b(numPlayers)b(maxPlayers)b(numBots)c(dedicated)c(os)b(password)b(secure)S(gameVersion)';
    return bufferpack.unpack(format, buff, position || 0);
  }
};