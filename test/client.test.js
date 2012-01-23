
var should = require('should');

var sq = require('../lib/client');

//var host = 'twgamerzclassic.game.nfoservers.com';
//var host = 'xeno2.game.nfoservers.com';
var host = 'cDS.game.nfoservers.com';
var port = 27015;

describe('client', function() {
  it('should get info', function(done) {
    //this.timeout(10000);
    var client = new sq(host, port);
    client.getInfo(function(error, result) {
      should.not.exist(error);
      result.type.should.equal('I');
      done();
    });
  });

  it('should challenge', function(done) {
    this.timeout(10000);
    var client = new sq(host, port);
    client.getChallenge(function(error, result) {
      should.not.exist(error);
      result.type.should.equal('A');
      result.challenge.should.be.a('number');
      done();
    });
  });

  it('should get players', function(done) {
    this.timeout(10000);
    var client = new sq(host, port);
    client.getPlayers(function(error, result) {
      result.type.should.equal('D');
      result.numPlayers.should.be.a('number');
      result.players.should.be.an.instanceof(Array);
      done();
    });
  });

  it('should get rules', function(done) {
    this.timeout(10000);
    var client = new sq(host, port);
    client.getRules(function(error, result) {
      result.type.should.equal('E');
      result.numRules.should.be.a('number');
      result.rules.should.be.an.instanceof(Array);
      done();
    });
  });
});
