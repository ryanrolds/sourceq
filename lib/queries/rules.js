
var bufferpack = require('bufferpack');

module.exports = {
  'message': function(challenge) {
    return bufferpack.pack('<lcl', [-1, 'V', challenge || -1]);
  },
  'processor': function(buffer, position) {
    if(!position) {
      position = 0;
    }

    var headerFormat = '<c(type)b(numRules)';
    var data = bufferpack.unpack(headerFormat, buffer, position);

    data.rules = [];

    position += bufferpack.calcLength(headerFormat, buffer) + 1;
    var ruleFormat = '<S(name)S(value)';
    for(var i = 0, l = data.numRules; i < l; i++) {
      var rule = bufferpack.unpack(ruleFormat, buffer, position);

      data.rules.push(rule);
      position += 2 + rule.name.length + rule.value.length;
    }

    return data;
  }
};