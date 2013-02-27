var Encoder   = exports.Encoder   = require("./encoder"),
    Decoder   = exports.Decoder   = require("./decoder"),
    Framer    = exports.Framer    = require("./framer"),
    Unframer  = exports.Unframer  = require("./unframer");

exports.wrap = function wrap(stream) {
  var enc = new Encoder();
  var dec = new Decoder();
  
  // pipe burro streams
  enc .pipe(new Framer())
      .pipe(stream)
      .pipe(new Unframer())
      .pipe(dec);
  
  // shim
  var shim    = Object.create(enc);
  shim.pipe   = dec.pipe.bind(dec);
  shim.unpipe = dec.unpipe.bind(dec);
  return shim;
};
