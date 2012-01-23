
var buffer = require('buffer');

var bufferpack = require('bufferpack');

module.exports = {
  'message': function(challenge) {
    return jbuffer.pack('ch', ['U', challenge]);
  },
  'processor': [
    {'key': 'type', 'type': 'char'},
    {'key': 'challenge', 'type': 'long'}
  ]
};