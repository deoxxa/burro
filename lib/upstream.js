var Transform = require("stream").Transform,
    util      = require("util");

var Upstream = module.exports = function Upstream() {
  Transform.call(this);
};
util.inherits(Upstream, Transform);

Upstream.prototype._transform = function _transform(chunk, outputFn, callback) {
  // // <Buffer 0 0 0 0 " p a c k e t ">
  // var buf = Buffer.concat([new Buffer(4), chunk]);

  // // <Buffer 0 0 0 8 " p a c k e t ">
  // buf.writeUInt32BE(buf.length - 4, 0);

  var len = chunk.length,
      buf = new Buffer(len + 4);

  buf.writeUInt32BE(len, 0);
  chunk.copy(buf, 4);
  
  // make readable
  this.emit("packet", buf);
  outputFn(buf);
  
  // return
  callback(null);
};

Upstream.prototype.pack = function pack(input) {

  // stringify
  var json = JSON.stringify(input);

  // write
  if (! this.write(json)) {
    // buffering?
  }
  // make chainable
  return this;
};
