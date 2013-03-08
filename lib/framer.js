var stream  = require("stream"),
    util    = require("util");

var Framer = module.exports = function Framer() {
  stream.Transform.call(this);
};
util.inherits(Framer, stream.Transform);

Framer.prototype._transform = function _transform(chunk, encoding, callback) {
  // <Buffer 0 0 0 0 0 0 0 0 0 0 0 0>
  var buf = new Buffer(chunk.length + 4);
  
  // <Buffer 0 0 0 8 0 0 0 0 0 0 0 0>
  buf.writeUInt32BE(chunk.length, 0);

  // <Buffer 0 0 0 8 " p a c k e t ">
  chunk.copy(buf, 4);
  
  // make readable
  this.emit("packet", buf);
  this.push(buf);
  
  // return
  callback(null);
};
