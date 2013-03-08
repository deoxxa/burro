var stream  = require("stream"),
    util    = require("util");                                                               

var Unframer = module.exports = function Unframer() {
  stream.Transform.call(this, {objectMode: true});
  this._buffer = new Buffer(0);
  this._length = null;
};
util.inherits(Unframer, stream.Transform);

Unframer.prototype._transform = function _transform(chunk, encoding, done) {
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
      this.push(this._buffer.slice(0, this._length));
      this._buffer = this._buffer.slice(this._length);
      this._length = null;
    }
    
    // not enough buffer for anything useful
    else {
      break;
    }
  }

  done(null);
};
