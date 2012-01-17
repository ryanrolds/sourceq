
module.exports = {
  'message': function() {
    return [
      {'value': 'U', 'type': 'char'},
      {'value': -1, 'type': 'long'}
    ]
  },
  'processor': [
    {'key': 'type', 'type': 'char'},
    {'key': 'challenge', 'type': 'long'}
  ]
};