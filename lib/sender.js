var Transform = require("stream").Transform,
    util      = require("util");

var Sender = module.exports = function Sender() {
  Transform.call(this);
};
util.inherits(Sender, Transform);

Sender.prototype._transform = function _transform(chunk, outputFn, callback) {
  // <Buffer 0 0 0 0 0 0 0 0 0 0 0 0>
  var buf = new Buffer(chunk.length + 4);
  
  // <Buffer 0 0 0 8 0 0 0 0 0 0 0 0>
  buf.writeUInt32BE(chunk.length, 0);

  // <Buffer 0 0 0 8 " p a c k e t ">
  chunk.copy(buf, 4);
  
  // make readable
  this.emit("packet", buf);
  outputFn(buf);
  
  // return
  callback(null);
};

Sender.prototype.pack = function pack(input) {
  this.write(JSON.stringify(input));
  return this;
};
