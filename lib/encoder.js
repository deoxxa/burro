var Transform = require("stream").Transform,
    util      = require("util");

var Encoder = module.exports = function Encoder() {
  Transform.call(this);
};
util.inherits(Encoder, Transform);

Encoder.prototype._transform = function _transform(chunk, output, callback) {
  // <Buffer 0 0 0 0 0 0 0 0 0 0 0 0>
  var buf = new Buffer(chunk.length + 4);
  
  // <Buffer 0 0 0 8 0 0 0 0 0 0 0 0>
  buf.writeUInt32BE(chunk.length, 0);

  // <Buffer 0 0 0 8 " p a c k e t ">
  chunk.copy(buf, 4);
  
  // make readable
  this.emit("packet", buf);
  output(buf);
  
  // return
  callback(null);
};

Encoder.prototype.__write__ = Encoder.prototype.write;
Encoder.prototype.write = function write(chunk, encoding, done) {
  return this.__write__(JSON.stringify(chunk), encoding, done);
};
