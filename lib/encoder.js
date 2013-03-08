var stream  = require("stream"),
    util    = require("util");

var Encoder = module.exports = function Encoder() {
  stream.Transform.call(this, {objectMode: true});
};
util.inherits(Encoder, stream.Transform);

Encoder.prototype._transform = function _transform(obj, encoding, callback) {
  this.push(JSON.stringify(obj));
  callback(null);
};
