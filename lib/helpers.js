
exports.prepareMessage = function(message) {
  var size = 4;

  for(var i = 0, l = message.length; i < l; i++) {
    size += sizeOf(message[i]);
  }

  var buffer = new Buffer(size);
  buffer.fill(0);
  buffer.writeInt32LE(-1, 0);

  var offset = 4;
  for(var i = 0, l = message.length; i < l; i++) {
    var part = message[i];

    var type = part.type;
    var value = part.value;
    var partSize = sizeOf(part);

    if('string' === type) {
      buffer.write(value, offset);
    } else if('char' === type) {
      buffer.write(value, offset, 1);
    } else if('byte' === type) {
      buffer.writeInt8(value, offset);
    } else if('short' === type) {
      buffer.writeInt16LE(value, offset);
    } else if('long' === type) {
      buffer.writeInt32LE(value, offset);
    } else if('float' === type) {
      buffer.writeFloatLE(value, offset);
    } else if('long long' === type) {
      // Possible to use a double?
      //data[key] = buffer.readInt32LE(offset);
    } else {
      throw new Error('Unknown type (' + type + ')');
    }

    offset += partSize;
  }

  return buffer;
};

exports.messageProcessor = function(buffer, legend) {
  var offset = 0;
  var data = {};

  //Header 
  var isSplit = (buffer.readInt32LE(offset) === -2) ? true : false;
  if(isSplit) {
    
  }

  offset += 4;
  
  for(var i = 0, l = legend.length; i < l; i++) {
    var item = legend[i];

    var key = item.key;
    var type = item.type;
    var size = sizeOf(item);

    if('string' === type) {
      data[key] = buffer.toString('utf8', offset, offset + size - 1);
    } else if('char' === type) {
      data[key] = buffer.toString('utf8', offset, offset + size);
    } else if('byte' === type) {
      data[key] = buffer.readInt8(offset);
    } else if('short' === type) {
      data[key] = buffer.readInt16LE(offset);
    } else if('long' === type) {
      data[key] = buffer.readInt32LE(offset);
    } else if('float' === type) {
      data[key] = buffer.readFloatLE(offset);
    } else if('long long' === type) {
      // Possible to use a double?
      //data[key] = buffer.readInt32LE(offset);
    } else {
      throw new Error('Unknown type (' + type + ')');
    }

    offset += size;
  }
  
  return data;
};

exports.sizeOf = function(messagePart) {
  var type = messagePart.type;
  var value = messagePart.value;
  var size = 1;

  if('string' === type) {
    size = value.length + 1;
  } else if('char' === type) {
    size = 1;
  } else if('byte' === type) {
    size = 1;
  } else if('short' === type) {
    size = 2;
  } else if('long' === type) {
    size = 4;
  } else if('float' === type) {
    size = 4;
  } else if('long long' === type) {
    size = 8
  } else {
    throw new Error('Unknown type (' + type + ')');
  }

  return size;
};

exports.strSize = function(buffer, offset) {
  var nullOffset = offset;

  while(buffer[nullOffset] !== 0) {
    nullOffset++;
  }

  return nullOffset - offset;
};