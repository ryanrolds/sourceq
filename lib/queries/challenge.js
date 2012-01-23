
var bufferpack = require('bufferpack');

module.exports = {
  'message': function() {
    return bufferpack.pack('<lcl', [-1, 'U', -1]);
  },
  'processor': function(buffer, position) {
    return bufferpack.unpack('<i(split)c(type)l(challenge)', buffer, position || 0);
  }
};