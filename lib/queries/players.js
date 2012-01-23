
var bufferpack = require('bufferpack');

module.exports = {
  'message': function(challenge) {
    console.log(challenge);
    return bufferpack.pack('<lcl', [-1, 'D', challenge || -1]);
  },
  'processor': function(buffer, position) {
    console.log(buffer, position);
    return bufferpack.unpack('<i(split)c(type)l(challenge)', buffer, position || 0);
  }
};