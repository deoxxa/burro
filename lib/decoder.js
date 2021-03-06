var stream  = require("stream"),
    util    = require("util");                                                               

var Decoder = module.exports = function Decoder() {
  stream.Transform.call(this, {objectMode: true});
};
util.inherits(Decoder, stream.Transform);

Decoder.prototype._transform = function _transform(chunk, encoding, done) {
  try {
    this.push(JSON.parse(chunk.toString("utf8")));
  }
  catch (error) {
    done(error);
  }
  done(null);
};
