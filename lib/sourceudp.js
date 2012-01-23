
var dgram = require('dgram');

module.exports = (function() {
  var SourceUDP = function(host, port) {
    this.host = host || 'localhost';
    this.port = port || 27015;
    this.waiting = false;

    this.sock = dgram.createSocket('udp4');
    var that = this;
    this.sock.on('message', function(message, rinfo) { that.onMessage(message, rinfo); });
    this.sock.on('error', function(message, rinfo) { that.onError(message, rinfo); });
  };

  SourceUDP.prototype.onMessage = function(message, rinfo) {
    console.log('response', message, rinfo);
    if(this.resCallback) {
      this.waiting = false;
      this.resCallback(null, message);
    }
  };
 
  SourceUDP.prototype.onError = function(error) {
    if(this.resCallback) {
      this.resCallback(error);
      this.waiting = false;
    }
  };

  SourceUDP.prototype.send = function(message, callback) {
    this.resCallback = callback;
    this.waiting = true;
    console.log('request', message, callback);
    this.sock.send(message, 0, message.length, this.port, this.host);
  };

  SourceUDP.prototype.isWaiting = function() {
    return this.waiting;
  };

  SourceUDP.prototype.close = function() {
    this.sock.close();
  };

  return SourceUDP;

})();