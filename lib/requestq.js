

module.exports = (function() {
  var RequestQ = function() {
    this.clear();    
  };

  RequestQ.prototype.addRequest = function(message, callback) {
    return this.requests.push([message, callback]);
  };

  RequestQ.prototype.next = function() {
    return this.requests.shift();
  };

  RequestQ.prototype.length = function() {
    return this.requests.length;
  };

  RequestQ.prototype.clear = function() {
    this.requests = [];
  };

  return RequestQ;
})();