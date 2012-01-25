
var dgram = require('dgram');

var Buffers = require('buffers');
var bufferpack = require('bufferpack');

module.exports = (function() {
  var SourceUDP = function(host, port) {
    this.host = host || 'localhost';
    this.port = port || 27015;
    this.waiting = false;

    this.buffs = []; // Stores buffers
    this.sock = dgram.createSocket('udp4');
    var that = this;
    this.sock.on('message', function(message, rinfo) { that.onMessage(message, rinfo); });
    this.sock.on('error', function(message, rinfo) { that.onError(message, rinfo); });
  };

  SourceUDP.prototype.onMessage = function(message, rinfo) {
    var completed = bufferpack.unpack('<l(split)', message, 0).split !== -2 ? true : false;
    if(!completed) {
      var header = bufferpack.unpack('<l(split)l(id)b(num)b(pos)h(size)', message, 0);

      // it slices at 16 instead of 12 to remove long before body
      this.buffs.splice(header.pos, 0, message.slice(16));

      if(this.buffs.length === header.num) {
        completed = true;
      }
    } else {
      this.buffs.push(message.slice(4));
    }
        
    if(completed && this.resCallback) {
      var buffers = Buffers();
      this.buffs.forEach(function(buffer) {
        buffers.push(buffer);
      });

      this.buffs = [];
      this.waiting = false;
      this.resCallback(null, buffers.toBuffer());
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