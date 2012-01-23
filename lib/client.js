
var dgram = require('dgram');
var Emitter = require('events').EventEmitter;

var RequestQ = require('./requestq');
var SourceUdp = require('./sourceudp');

var infoQuery = require('./queries/info');
var challengeQuery = require('./queries/challenge');
var playersQuery = require('./queries/players');
var rulesQuery = require('./queries/rules');

module.exports = (function() {
  var Client = function(host, port) {
    this.sourceUdp = new SourceUdp(host, port);
    this.queue = new RequestQ();

    this.challenge; // Key for getting players and rules
  };

  Client.prototype.performRequest = function () {
    var that = this;
    if(!this.sourceUdp.isWaiting() && this.queue.length()) {
      var request = that.queue.next();

      that.sourceUdp.send(request[0], function() {
        request[1].apply(this, arguments);
        that.performRequest(); // Try to do another request
      });
    }
  };

  Client.prototype.addRequest = function(message, callback) {
    this.queue.addRequest(message, callback);
    this.performRequest(); // Try to do a request
  };

  Client.prototype.getInfo = function(callback) {
    this.addRequest(infoQuery.message(), function(error, data) {
      if(error) {
        return callback(error);
      }

      callback(null, infoQuery.processor(data));
    });
  };

  Client.prototype.getChallenge = function(callback) {
    var that = this;
    this.addRequest(challengeQuery.message(), function(error, data) {
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
      that.addRequest(playersQuery.message(challenge), function(error, data) {
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

  Client.prototype.getRules = function(callback) {
    var that = this;
    var getRules = function(challenge) {
      that.addRequest(rulesQuery.message(challenge), function(error, data) {
        if(error) {
          return callback(error);
        }

        var rules = rulesQuery.processor(data);
        callback(null, rules);
      });
    };

    if(!this.challenge) {
      this.getChallenge(function(res, data) {
        getRules(data.challenge);
      });
    } else {
      getRules(this.challenge);
    } 
  };

  return Client;
})();