var Encoder   = exports.Encoder   = require("./encoder"),
    Decoder   = exports.Decoder   = require("./decoder"),
    Framer    = exports.Framer    = require("./framer"),
    Unframer  = exports.Unframer  = require("./unframer");

exports.wrap = function wrap(stream) {
  var enc = new Encoder();
  var dec = new Decoder();
  
  enc .pipe(new Framer())
      .pipe(stream)
      .pipe(new Unframer())
      .pipe(dec);

  enc.pipe = function(dest) {
    delete this.pipe;
    return dec.pipe(dest);
  };
  
  return enc;
};
