
var buffer = require('buffer');

var jspack = require('jspack').jspack;

module.exports = {
  'message': function() {
    var message = 'TSource Engine Query';
    return jspack.PackTo('<iS', new Buffer(4 + message.length + 1), 0, [-1, message]);
  },
  'processor': function(buff, position) {
    position = position || 0;
    var data = jspack.Unpack('<icbSSSShbbbccbbSb', buff, position);

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

    return info;
  }
};