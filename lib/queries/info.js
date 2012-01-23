
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

    /*
    var info = {
      'type': data[1],
      'version': data[2],
      'name': data[3],
      'map': data[4],
      'directory': data[5],
      'description': data[6],
      'appId': data[7],
      'numPlayers': data[8],
      'maxPlayers': data[9],
      'numBots': data[10],
      'dedicated': !!data[11],
      'os': data[12],
      'password': data[13],
      'secure': data[14],
      'gameVersion': data[15]
    };

    //@TODO support for extra data

    return info;
    */
  }
};