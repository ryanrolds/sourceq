
var dgram = require('dgram');
var Emitter = require('events').EventEmitter;

var RequestQ = require('./requestq');
var SourceUdp = require('./sourceudp');

var infoQuery = require('./queries/info');
var challengeQuery = require('./queries/challenge');
var playersQuery = require('./queries/players');

module.exports = (function() {
  var Client = function(host, port) {
    this.sourceUdp = new SourceUdp(host, port);
    this.queue = new RequestQ();

    var that = this;
    process.nextTick();

    this.challenge;
  };

  Client.prototype.performRequest = function () {
    console.log('asdfasdf');
    console.log(!that.sourceUdp.isWaiting() && that.queue.length());
    if(!that.sourceUdp.isWaiting() && that.queue.length()) {
      var request = that.queue.next();
      console.log('request', request);
      that.sourceUdp.send(request[0], request[1]);
    }
  };

  Client.prototype.getInfo = function(callback) {
    this.queue.addRequest(infoQuery.message(), function(error, data) {
      if(error) {
        return callback(error);
      }

      callback(null, infoQuery.processor(data));
    });
  };

  Client.prototype.getChallenge = function(callback) {
    var that = this;
    this.queue.addRequest(challengeQuery.message(), function(error, data) {
      if(error) {
        return callback(error);
      }

      var challenge = challengeQuery.processor(data);
      that.challenge = challenge.challenge;
      callback(null, challenge);
    });
  };

  Client.prototype.getPlayers = function(callback) {
    var that = this;
    var getPlayers = function(challenge) {
      that.queue.addRequest(playersQuery.message(challenge), function(error, data) {
        if(error) {
          return callback(error);
        }

        var players = playersQuery.processor(data);
        callback(null, players);
      });
    };

    if(!this.challenge) {
      this.getChallenge(function(res, data) {
        getPlayers(data.challenge);
      });
    } else {
      getPlayers(this.challenge);
    } 
  };

  return Client;
})();