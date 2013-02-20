var Transform = require("stream").Transform,
    util      = require("util");

var Downstream = module.exports = function Downstream() {
  Transform.call(this);
  this._buffer = new Buffer(0);
  this._length = null;
};
util.inherits(Downstream, Transform);

Downstream.prototype._transform = function _transform(chunk, outputFn, callback) {
  
  // append
  this._buffer = Buffer.concat([this._buffer, chunk]);

  // loop; possibly received multiple packets
  while (true) {
    
    // get length prefix
    if (this._length === null && this._buffer.length >= 4) {
      this._length = this._buffer.readUInt32BE(0);
      this._buffer = this._buffer.slice(4);
      continue;
    }
    
    // get packet
    else if (typeof this._length === "number" && this._buffer.length >= this._length) {
      try {
        // parse
        var obj = JSON.parse(this._buffer.toString("utf8", 0, this._length));

        // make readable
        this.emit("packet", obj);
        outputFn(obj);

        // reset
        this._buffer = this._buffer.slice(this._length);
        this._length = null;
      } catch (error) {
        return callback(error);
      }
    }
    
    else {
      break;
    }
  }

  callback(null);
};
