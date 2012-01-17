
var dgram = require('dgram');
var Emitter = require('events').EventEmitter;

var infoQuery = require('./queries/info');
var challengeQuery = require('./queries/challenge');
var playersQuery = require('./queries/players');

module.exports = (function() {
  var Client = function(host, port) {
    this.host = host || 'localhost';
    this.port = port || 27015;
    
    this.queue = [];
    this.waiting = false;
    this.challenge;

    this.open();
  };

  Client.prototype.open = function() {
    var sock = this._sock = dgram.createSocket('udp4');
    var that = this;
    sock.on('message', function(message, rinfo) {
      console.log('message', message, rinfo);
      console.log(message.toString());

      var item = this.queue.shift();
      item[1](null, message);
    });
    
    sock.on('error', function(error) {
      console.log('error', error);
    });
  };

  Client.prototype.close = function() {
    this._sock.close();
  };

  Client.prototype.query = function(message, callback) {
    var sock = this._sock;

    console.log('message', message);

    if(this.waiting) {
      this.queue.push([message, callback]);
    }


    var that = this;

    var listener = function(error, message) {
      var type = message.toString('utf8', 4, 5);
      that.events.removeListener(type, listener);

      var data = messageProcessor(message, legend);
      console.log(data);
      callback(null, data);
    };

    console.log(message[0].value, responseMap[message[0].value]);
    this.events.on(responseMap[message[0].value], listener);
    
    sock.send(buffer, 0, buffer.length, this.port, this.host);
  };

  Client.prototype.getInfo = function(callback) {
    this.query(infoQuery.message(), infoQuery.processor, function(error, data) {
      callback(null, data);
    });
  };

  Client.prototype.getChallenge = function(callback) {
    this.query(challengeQuery.message(), challengeQuery.processor, function(error, data) {
      callback(null, data);
    });
  };

  Client.prototype.getPlayers = function(callback) {
    var that = this;
    var players = function(challenge) {
      console.log('challenge', challenge);
      that.query(playersQuery.message(challenge), playersQuery.processor, function(error, data) {
        callback(null, data);
      });
    };

    if(!this.challenge) {
      this.getChallenge(function(res, data) {
        players(data.challenge);
      });
    } else {
      players(this.challenge);
    }    
  };

  return Client;
})();
};