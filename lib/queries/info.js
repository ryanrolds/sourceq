
module.exports = {
  'message': function() {
    return [
      {'value': 'TSource Engine Query', 'type': 'string'}
    ];
  },
  'processor': [
    {'key': 'type', 'type': 'char'},
    {'key': 'steamVesrion', 'type': 'byte'},
    {'key': 'name', 'type': 'string'},
    {'key': 'map', 'type': 'string'},
    {'key': 'directory', 'type': 'string'},
    {'key': 'description', 'type': 'string'},
    {'key': 'appId', 'type': 'short'},
    {'key': 'numPlayers', 'type': 'byte'},
    {'key': 'maxPlayers', 'type': 'byte'},
    {'key': 'numBots', 'type': 'byte'},
    {'key': 'dedicated', 'type': 'char'},
    {'key': 'os', 'type': 'char'},
    {'key': 'password', 'type': 'byte'},
    {'key': 'secure', 'type': 'byte'},
  ]
};