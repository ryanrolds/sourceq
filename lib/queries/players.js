
var helpers = require('../helpers');

module.exports = {
  'message': function(challenge) {
    return [
      {'value': 'U', 'type': 'char'},
      {'value': challenge, 'type': 'long'}
    ];
  },
  'processor': [
    {'key': 'type', 'type': 'char'},
    {'key': 'challenge', 'type': 'long'}
  ]
};